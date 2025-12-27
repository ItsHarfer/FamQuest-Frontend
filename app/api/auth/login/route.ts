import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * User Login
 *
 * Leitet den Login an n8n weiter.
 * Die eigentliche Logik (Validierung, Session, etc.) läuft in n8n.
 *
 * ✅ Wichtig: Token wird als HttpOnly Cookie gesetzt (für Middleware / Route Protection)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const n8nWebhookUrl = process.env.N8N_AUTH_REGISTER_LOGIN_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_AUTH_REGISTER_LOGIN_URL is not set in environment variables')
      return NextResponse.json(
        {
          error: 'n8n webhook URL not configured',
          details: 'Please set N8N_AUTH_REGISTER_LOGIN_URL in your .env file',
        },
        { status: 500 }
      )
    }

    const payload = {
      action: 'login',
      email,
      password,
      timestamp: new Date().toISOString(),
    }

    const response = await callN8nWebhook(n8nWebhookUrl, payload)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available')
      console.error('n8n webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        url: n8nWebhookUrl,
        errorBody: errorText,
      })

      return NextResponse.json(
        {
          error: `n8n webhook failed: ${response.statusText}`,
          details: errorText || `HTTP ${response.status} error`,
        },
        { status: response.status }
      )
    }

    const responseText = await response.text()

    if (!responseText || responseText.trim() === '') {
      console.error('n8n webhook returned empty response')
      return NextResponse.json(
        {
          error: 'n8n webhook returned empty response',
          details:
            'The n8n workflow did not return any data. Please ensure it returns a JSON response.',
        },
        { status: 500 }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', {
        responseText,
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
      })
      return NextResponse.json(
        {
          error: 'Invalid response from n8n',
          details: `n8n returned non-JSON response: ${responseText.substring(0, 200)}`,
        },
        { status: 500 }
      )
    }

    // n8n kann Objekt oder Array liefern
    let responseData = data
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0]
    }

    if (responseData?.ok !== true || !responseData?.token) {
      return NextResponse.json(
        {
          error: responseData?.message || 'Invalid credentials',
          code: responseData?.code || 'AUTH_ERROR',
        },
        { status: 401 }
      )
    }

    const token = responseData.token
    const expiresAt = responseData.expiresAt // ISO String von n8n

    const res = NextResponse.json({
      ok: true,
      success: true,
      action: responseData.action ?? 'login',
      expiresAt,
    })

    // WICHTIG: Name + Path + Secure
    res.cookies.set('famquest_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // localhost => false
      path: '/', // MUSS / sein, sonst sieht middleware ihn nicht
      expires: expiresAt ? new Date(expiresAt) : undefined,
    })

    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}