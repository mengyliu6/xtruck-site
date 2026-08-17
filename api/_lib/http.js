export function setApiHeaders(res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('X-Content-Type-Options', 'nosniff')
}

export function sendJson(res, statusCode, payload) {
  setApiHeaders(res)
  return res.status(statusCode).json(payload)
}

export function requirePost(req, res) {
  if (req.method === 'POST') return true
  res.setHeader('Allow', 'POST')
  sendJson(res, 405, { error: 'Method not allowed.' })
  return false
}

export function requireGet(req, res) {
  if (req.method === 'GET') return true
  res.setHeader('Allow', 'GET')
  sendJson(res, 405, { error: 'Method not allowed.' })
  return false
}

export function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body)
  }

  if (Buffer.isBuffer(req.body) && req.body.length) {
    return JSON.parse(req.body.toString('utf8'))
  }

  return {}
}

export function getRequestHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()]
  return Array.isArray(value) ? value[0] : value
}

export function handleApiError(res, error, fallbackMessage) {
  const isConfigurationError = error instanceof Error && error.message.startsWith('CONFIG:')
  const isValidationError = error instanceof Error && error.message.startsWith('VALIDATION:')

  if (isConfigurationError) {
    return sendJson(res, 503, {
      code: 'PAYMENT_SETUP_REQUIRED',
      error: 'PayPal setup required. Checkout is temporarily unavailable.',
    })
  }

  if (isValidationError) {
    return sendJson(res, 400, { error: error.message.replace('VALIDATION:', '').trim() })
  }

  console.error(fallbackMessage, error)
  return sendJson(res, 500, { error: fallbackMessage })
}
