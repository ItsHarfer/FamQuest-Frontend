import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * User Registration
 * 
 * Leitet die Registrierung an n8n weiter.
 * Die eigentliche Logik (DB, Validierung, etc.) läuft in n8n.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { familyName, name, email, password } = body

    if (!familyName || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not set in environment variables')
      return NextResponse.json(
        { 
          error: 'n8n webhook URL not configured',
          details: 'Please set N8N_WEBHOOK_URL in your .env file'
        },
        { status: 500 }
      )
    }

    console.log('Calling n8n webhook:', n8nWebhookUrl)

    // Forward registration to n8n
    const payload = {
      action: 'register',
      familyName,
      name,
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

      // Provide helpful error messages based on status code
      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'n8n webhook endpoint not found',
            details: `The webhook URL "${n8nWebhookUrl}" returned 404. Please check:\n1. Is the webhook URL correct?\n2. Is the n8n workflow active?\n3. Is the webhook node properly configured?`
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { 
          error: `n8n webhook failed: ${response.statusText}`,
          details: errorText || `HTTP ${response.status} error`,
          status: response.status
        },
        { status: response.status }
      )
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type')
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      console.error('n8n webhook returned empty response')
      return NextResponse.json(
        { 
          error: 'n8n webhook returned empty response',
          details: 'The n8n workflow did not return any data. Please check your n8n workflow configuration and ensure it returns a JSON response.'
        },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', {
        responseText,
        contentType,
        error: parseError instanceof Error ? parseError.message : 'Unknown error'
      })
      return NextResponse.json(
        { 
          error: 'Invalid response from n8n',
          details: `n8n returned non-JSON response: ${responseText.substring(0, 200)}`,
          contentType
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: data.message,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
