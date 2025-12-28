import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Toggle Microstep
 * 
 * Toggles a microstep's done status.
 * Forwards the request to n8n for processing.
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie (user is authenticated)
    const token = request.cookies.get('famquest_token')?.value

    if (!token) {
      return NextResponse.json(
        { ok: false, code: 401, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, userId, questId, microstepId, timestamp } = body

    // Validate required fields
    if (!action || !userId || !questId || !microstepId) {
      return NextResponse.json(
        { 
          ok: false, 
          code: 400, 
          message: 'Missing required fields: action, userId, questId, microstepId' 
        },
        { status: 400 }
      )
    }

    // Get n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_MICROSTEP_TOGGLE_URL  

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { ok: false, code: 500, message: 'n8n webhook URL not configured' },
        { status: 500 }
      )
    }

    // Forward toggle request to n8n
    const payload = {
      action: 'toggleMicrostep',
      userId,
      questId,
      microstepId,
      timestamp: timestamp || new Date().toISOString(),
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

      // Map HTTP status to error code
      let errorCode = response.status
      if (response.status === 401) errorCode = 401
      else if (response.status === 404) errorCode = 404
      else if (response.status >= 400 && response.status < 500) errorCode = 400
      else errorCode = 500

      return NextResponse.json(
        { 
          ok: false, 
          code: errorCode, 
          message: errorData.message || 'Failed to toggle microstep',
          errors: errorData.errors || []
        },
        { status: response.status }
      )
    }

    // Parse success response
    const responseText = await response.text()
    
    if (!responseText || responseText.trim() === '') {
      return NextResponse.json(
        { ok: false, code: 500, message: 'Empty response from n8n' },
        { status: 500 }
      )
    }

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      return NextResponse.json(
        { ok: false, code: 500, message: 'Invalid response from n8n' },
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
          code: responseData?.code || 400, 
          message: responseData?.message || 'Microstep toggle failed' 
        },
        { status: responseData?.code || 400 }
      )
    }

    // Return success response with proper structure
    return NextResponse.json({
      ok: true,
      code: 200,
      questId: responseData.questId || questId,
      microstep: responseData.microstep || {
        id: microstepId,
        status: responseData.microstep?.status || 'DONE',
        done: responseData.microstep?.done !== undefined ? responseData.microstep.done : true,
        updatedAt: responseData.microstep?.updatedAt || new Date().toISOString(),
      },
      open_steps: Number(responseData.open_steps || 0),
      total_steps: Number(responseData.total_steps || 0),
      questCompleted: responseData.questCompleted === true,
      questStatus: responseData.questStatus || (responseData.questCompleted ? 'COMPLETED' : 'OPEN'),
    })
  } catch (error) {
    console.error('Toggle microstep error:', error)
    return NextResponse.json(
      { ok: false, code: 500, message: 'Failed to toggle microstep' },
      { status: 500 }
    )
  }
}

