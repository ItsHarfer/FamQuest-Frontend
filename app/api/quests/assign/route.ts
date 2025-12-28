import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Assign Quest
 * 
 * Assigns a quest to the current user.
 * Forwards the request to n8n for processing.
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

    const body = await request.json()
    const { questId } = body

    if (!questId) {
      return NextResponse.json(
        { error: 'Quest ID is required', code: 'MISSING_QUEST_ID' },
        { status: 400 }
      )
    }

    // Get user ID from /api/auth/me (we need to validate token and get userId)
    const meResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user information', code: 'AUTH_FAILED' },
        { status: 401 }
      )
    }

    const meData = await meResponse.json()
    const userId = meData.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found', code: 'USER_NOT_FOUND' },
        { status: 401 }
      )
    }

    // Get n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_QUEST_URL || process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: 'n8n webhook URL not configured', code: 'CONFIG_ERROR' },
        { status: 500 }
      )
    }

    // Forward assign request to n8n
    const payload = {
      action: 'assignQuest',
      userId,
      questId,
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
        // If not JSON, use the text
        errorData = { message: errorText }
      }

      // Handle specific error codes
      if (response.status === 409) {
        return NextResponse.json(
          { error: errorData.message || 'Quest is not available', code: 'QUEST_NOT_AVAILABLE' },
          { status: 409 }
        )
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: errorData.message || 'Not allowed to assign this quest', code: 'NOT_ALLOWED' },
          { status: 403 }
        )
      }

      if (response.status === 404) {
        return NextResponse.json(
          { error: errorData.message || 'Quest not found', code: 'NOT_FOUND' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: errorData.message || 'Failed to assign quest', code: 'ASSIGN_FAILED' },
        { status: response.status }
      )
    }

    // Parse success response
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { error: 'Empty response from n8n', code: 'EMPTY_RESPONSE' },
        { status: 500 }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid response from n8n', code: 'INVALID_RESPONSE' },
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
        { error: responseData?.message || 'Quest assignment failed', code: responseData?.code || 'ASSIGN_FAILED' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      quest: responseData.quest || {
        id: questId,
        assigned_to: userId,
        status: 'OPEN',
      },
    })
  } catch (error) {
    console.error('Assign quest error:', error)
    return NextResponse.json(
      { error: 'Failed to assign quest', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}

