import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Guildmaster Intro Endpoint
 * 
 * Returns an intro message from the Guildmaster AI.
 * This is called once when the user first opens the Guildmaster chat.
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie (user is authenticated)
    const token = request.cookies.get('famquest_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Get request body for clientState.localTime and timeZone
    const body = await request.json().catch(() => ({}))
    const { clientState } = body
    const localTime = clientState?.localTime || new Date().toISOString()
    const timeZone = clientState?.timeZone || 'UTC'

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_GUILDMASTER_INTRO_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_GUILDMASTER_INTRO_URL is not set in environment variables')
      return NextResponse.json(
        { 
          error: 'n8n webhook URL not configured',
          details: 'Please set N8N_GUILDMASTER_INTRO_URL in your .env file'
        },
        { status: 500 }
      )
    }

    // Prepare payload for n8n
    // Token wird mitgesendet für Authentifizierung in n8n
    const payload = {
      action: 'intro',
      token, // Token aus Cookie für Authentifizierung in n8n
      clientState: {
        localTime, // Client's local time
        timeZone, // Client's timezone (e.g., "Europe/Berlin", "America/New_York")
      },
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

    // Handle array response from n8n (common format)
    let responseData = data
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0]
    }

    // Extract intro message from n8n response
    // n8n can return different formats:
    // 1. Simple format: { assistant_message: "...", message: "..." }
    // 2. Complex format: { output: [{ content: [{ text: "..." }] }] }
    let introMessage: string | null = null

    // Try simple formats first
    introMessage = responseData?.assistant_message || responseData?.message || responseData?.intro_message

    // Try complex format: output[0].content[0].text
    if (!introMessage && responseData?.output && Array.isArray(responseData.output) && responseData.output.length > 0) {
      const firstOutput = responseData.output[0]
      if (firstOutput?.content && Array.isArray(firstOutput.content) && firstOutput.content.length > 0) {
        const firstContent = firstOutput.content[0]
        introMessage = firstContent?.text || null
      }
    }

    if (!introMessage) {
      console.error('No intro message found in n8n response:', JSON.stringify(responseData, null, 2))
      return NextResponse.json(
        { 
          error: 'No intro message in n8n response',
          details: 'The n8n workflow did not return an intro message in the expected format.'
        },
        { status: 500 }
      )
    }

    // Return intro message
    return NextResponse.json({
      success: true,
      ok: responseData?.ok !== false,
      message: introMessage,
    })
  } catch (error) {
    console.error('Guildmaster intro error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get intro message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

