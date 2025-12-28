import { NextRequest, NextResponse } from 'next/server'
import { callN8nWebhook } from '@/lib/n8n'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const webhookUrl = process.env.N8N_QUEST_URL
    if (!webhookUrl) {
      return NextResponse.json({ error: 'N8N_QUEST_URL not configured' }, { status: 500 })
    }

    const payload = {
      action: 'getQuests',
      userId,
      timestamp: new Date().toISOString(),
    }

    const res = await callN8nWebhook(webhookUrl, payload)
    const text = await res.text()

    if (!res.ok) {
      return NextResponse.json(
        { error: 'n8n quest webhook failed', status: res.status, details: text },
        { status: 502 }
      )
    }

    const data = text ? JSON.parse(text) : {}
    return NextResponse.json(data)
  } catch (e) {
    console.error('GET /api/quests error:', e)
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 })
  }
}