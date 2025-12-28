// lib/auth.ts
import { cookies } from 'next/headers'
import { callN8nWebhook } from '@/lib/n8n'

export async function getUserFromCookie() {
  const token = cookies().get('famquest_token')?.value
  if (!token) return null

  const meUrl = process.env.N8N_AUTH_ME_WEBHOOK_URL
  if (!meUrl) throw new Error('N8N_AUTH_ME_WEBHOOK_URL not configured')

  const res = await callN8nWebhook(meUrl, { token })
  if (!res.ok) return null

  const data = await res.json()
  return data?.user ?? null
}