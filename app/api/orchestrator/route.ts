import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Orchestrator Endpoint
 * 
 * Bridge zwischen Frontend und n8n.
 * Alle Datenbankoperationen und Authentifizierung laufen in n8n.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, imageData, userId, userEmail, userName } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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

    // Prepare payload for n8n
    // User data wird in n8n validiert und geholt
    const payload = {
      message,
      userId, // Wird vom Frontend übergeben (später über n8n Session validiert)
      userEmail,
      userName,
      imageData, // For PHOTO_AI verification
      timestamp: new Date().toISOString(),
    }

    // Call n8n webhook
    const response = await callN8nWebhook(n8nWebhookUrl, payload)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available')
      console.error('n8n webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        url: n8nWebhookUrl,
        errorBody: errorText,
      })

      if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'n8n webhook endpoint not found',
            details: `The webhook URL "${n8nWebhookUrl}" returned 404. Please check if the webhook is active in n8n.`
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { 
          error: `n8n webhook failed: ${response.statusText}`,
          details: errorText || `HTTP ${response.status} error`
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

    // Return response from n8n (Guild Master message)
    return NextResponse.json({
      success: true,
      message: data.message || 'The Guild Master acknowledges your request.',
      questsUpdated: data.questsUpdated || false,
      quests: data.quests || [],
    })
  } catch (error) {
    console.error('Orchestrator error:', error)
    return NextResponse.json(
      {
        error: 'The mists have clouded the connection. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

