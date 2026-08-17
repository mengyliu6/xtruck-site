export function readJsonBody(request) {
  if (!request.body) return {}
  if (typeof request.body === 'string') return JSON.parse(request.body)
  return request.body
}

export function sendJson(response, status, body) {
  response.setHeader('Cache-Control', 'no-store')
  response.status(status).json(body)
}

export function requirePost(request, response) {
  if (request.method === 'POST') return true
  response.setHeader('Allow', 'POST')
  sendJson(response, 405, { error: 'Method not allowed.' })
  return false
}

export function publicError(error, fallback) {
  if (error instanceof Error && error.message.startsWith('CONFIG:')) {
    return { status: 503, message: error.message.replace('CONFIG:', '').trim() }
  }

  return { status: 500, message: fallback }
}
