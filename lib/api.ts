// lib/api.ts
export type ApiError = {
    status: number
    message: string
    details?: any
  }
  
  export async function apiFetch<T>(
    input: string,
    init: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(input, {
      ...init,
      // wichtig: Cookies (famquest_token) automatisch mitsenden
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
  
    const text = await res.text()
    const data = text ? safeJson(text) : null
  
    if (!res.ok) {
      const err: ApiError = {
        status: res.status,
        message:
          (data && (data.error || data.message)) ||
          res.statusText ||
          'Request failed',
        details: data,
      }
      throw err
    }
  
    return data as T
  }
  
  function safeJson(text: string) {
    try {
      return JSON.parse(text)
    } catch {
      return { raw: text }
    }
  }