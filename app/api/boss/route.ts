import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

/**
 * Get Boss Battle Data
 * 
 * Holt Boss-Daten über n8n.
 * Session-Validierung läuft in n8n.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: 'n8n webhook URL not configured' },
        { status: 500 }
      )
    }

    // Fetch boss data from n8n
    const payload = {
      action: 'getBoss',
      userId,
      timestamp: new Date().toISOString(),
    }

    const response = await callN8nWebhook(n8nWebhookUrl, payload)

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      boss: data.boss,
      progress: data.progress,
    })
  } catch (error) {
    console.error('Error fetching boss data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boss data' },
      { status: 500 }
    )
  }
}
