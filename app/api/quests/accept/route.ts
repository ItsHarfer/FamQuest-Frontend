import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Accept Quest
 * 
 * Accepts/assigns a quest to the current user.
 * Forwards the request to n8n for processing.
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie (user is authenticated)
    const token = request.cookies.get('famquest_token')?.value

    if (!token) {
      return NextResponse.json(
        { ok: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { questId, userId } = body

    // Validate required fields
    if (!questId || !userId) {
      return NextResponse.json(
        { ok: false, message: 'Missing required fields: questId and userId are required' },
        { status: 400 }
      )
    }

    // Get n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_QUEST_ACCEPT_URL  

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { ok: false, message: 'n8n webhook URL not configured' },
        { status: 500 }
      )
    }

    // Forward accept request to n8n
    const payload = {
      action: 'acceptQuest',
      questId,
      userId,
      timestamp: new Date().toISOString(),
    }

    const response = await callN8nWebhook(n8nWebhookUrl, payload)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available')
      
      // Try to parse error response
      let errorData: any = {}
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      return NextResponse.json(
        { 
          ok: false, 
          message: errorData.message || 'Failed to accept quest' 
        },
        { status: response.status }
      )
    }

    // Parse success response
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { ok: false, message: 'Empty response from n8n' },
        { status: 500 }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json(
        { ok: false, message: 'Invalid response from n8n' },
        { status: 500 }
      )
    }

    // Handle array response
    let responseData = data
    if (Array.isArray(data) && data.length > 0) {
      responseData = data[0]
    }

    if (responseData?.ok !== true) {
      return NextResponse.json(
        { 
          ok: false, 
          message: responseData?.message || 'Quest acceptance failed' 
        },
        { status: 400 }
      )
    }

    // Return success response
    return NextResponse.json({
      ok: true,
      quest: responseData.quest || {
        id: questId,
        status: 'ASSIGNED',
        assigned_to: userId,
      },
    })
  } catch (error) {
    console.error('Accept quest error:', error)
    return NextResponse.json(
      { ok: false, message: 'Failed to accept quest' },
      { status: 500 }
    )
  }
}

