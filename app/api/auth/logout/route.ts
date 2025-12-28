import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * User Logout
 * 
 * Leitet den Logout an n8n weiter und löscht den Cookie.
 * Die Session wird in n8n gelöscht.
 */
export async function POST(request: NextRequest) {
  try {
    // Token aus Cookie lesen
    const token = request.cookies.get('famquest_token')?.value

    if (!token) {
      // Wenn kein Token vorhanden ist, Cookie trotzdem löschen und weiterleiten
      const response = NextResponse.json({ success: true })
      response.cookies.delete('famquest_token')
      return response
    }

    // Get n8n logout webhook URL from environment variables
    const n8nLogoutUrl = process.env.N8N_AUTH_LOGOUT_URL || process.env.N8N_WEBHOOK_URL

    if (!n8nLogoutUrl) {
      console.error('N8N_AUTH_LOGOUT_URL is not set in environment variables')
      // Even if n8n is not configured, delete the cookie
      const response = NextResponse.json({ success: true, warning: 'n8n logout URL not configured' })
      response.cookies.delete('famquest_token')
      return response
    }

    // Forward logout to n8n
    const payload = {
      action: 'logout',
      token,
    }

    const response = await callN8nWebhook(n8nLogoutUrl, payload)

    // Delete cookie regardless of n8n response (logout should always succeed on client side)
    const nextResponse = NextResponse.json({ success: true })
    nextResponse.cookies.delete('famquest_token')

    // Log if n8n returned an error (but don't fail the logout)
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available')
      console.error('n8n logout webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        url: n8nLogoutUrl,
        errorBody: errorText,
      })
    }

    return nextResponse
  } catch (error) {
    console.error('Logout error:', error)
    
    // Even on error, delete the cookie to ensure user is logged out on client side
    const response = NextResponse.json({ success: true, warning: 'Logout completed locally' })
    response.cookies.delete('famquest_token')
    return response
  }
}

