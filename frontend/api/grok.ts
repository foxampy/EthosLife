// Vercel Edge Function — proxies xAI Grok API to avoid browser CORS restrictions.
// The API key lives only in this server-side function, never in the browser bundle.

export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.VITE_GROK_API_KEY || process.env.GROK_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Grok API key not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.text()

  const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  })

  const responseText = await upstream.text()

  return new Response(responseText, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
