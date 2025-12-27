// Client for n8n Webhook Calls
export async function callN8nWebhook(
  webhookUrl: string,
  payload: Record<string, any>
): Promise<Response> {
  try {
    console.log('Sending request to n8n:', {
      url: webhookUrl,
      payload: JSON.stringify(payload, null, 2),
    })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Log response details for debugging
    const contentType = response.headers.get('content-type')
    console.log('n8n Response:', {
      status: response.status,
      statusText: response.statusText,
      contentType,
      ok: response.ok,
    })

    // Log error details for debugging
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available')
      console.error('n8n Webhook Error:', {
        status: response.status,
        statusText: response.statusText,
        url: webhookUrl,
        errorBody: errorText,
      })
    }

    return response
  } catch (error) {
    console.error('n8n Webhook Request Failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: webhookUrl,
    })
    throw error
  }
}

