import { NextRequest, NextResponse } from 'next/server'

/**
 * Get Current User
 * 
 * Holt Benutzerdaten über n8n basierend auf dem Token im Cookie.
 * Der Token wird von der Middleware bereits validiert.
 */
export async function GET(request: NextRequest) {
  try {
    // Token aus Cookie lesen (wird von Middleware bereits geprüft)
    const token = request.cookies.get('famquest_token')?.value

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'No token found' },
        { status: 401 }
      )
    }

    const N8N_ME_URL = process.env.N8N_AUTH_ME_WEBHOOK_URL || process.env.N8N_AUTH_REGISTER_LOGIN_URL

    if (!N8N_ME_URL) {
      return NextResponse.json(
        { ok: false, error: 'n8n webhook URL not configured' },
        { status: 500 }
      )
    }

    // Validate token and get user data from n8n
    const r = await fetch(N8N_ME_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'validateToken',
        token 
      }),
      cache: 'no-store',
    })

    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: 'Token validation failed' },
        { status: 401 }
      )
    }

    const responseText = await r.text()
    
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { ok: false, error: 'Empty response from n8n' },
        { status: 500 }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid response from n8n' },
        { status: 500 }
      )
    }

    // Handle array response
    let responseData = data
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0]
    }

    if (responseData?.ok !== true || !responseData?.user) {
      return NextResponse.json(
        { ok: false, error: responseData?.message || 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({ ok: true, user: responseData.user }, { status: 200 })
  } catch (e) {
    console.error('Error in /api/auth/me:', e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

// Keep POST for backwards compatibility (if needed)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = body?.token || req.cookies.get('famquest_token')?.value

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 })
    }

    const N8N_ME_URL = process.env.N8N_AUTH_ME_WEBHOOK_URL || process.env.N8N_AUTH_REGISTER_LOGIN_URL

    if (!N8N_ME_URL) {
      return NextResponse.json(
        { ok: false, error: 'n8n webhook URL not configured' },
        { status: 500 }
      )
    }

    const r = await fetch(N8N_ME_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'validateToken',
        token 
      }),
      cache: 'no-store',
    })

    const responseText = await r.text()
    const data = responseText ? JSON.parse(responseText) : {}

    // Handle array response
    let responseData = data
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0]
    }

    if (!r.ok || responseData?.ok !== true || !responseData?.user) {
      return NextResponse.json({ ok: false, error: responseData?.error || 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ ok: true, user: responseData.user }, { status: 200 })
  } catch (e) {
    console.error('Error in /api/auth/me POST:', e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}