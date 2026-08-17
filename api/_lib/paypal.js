function getPayPalBaseUrl() {
  const environment = process.env.PAYPAL_ENV?.trim() || 'sandbox'
  if (!['sandbox', 'live'].includes(environment)) {
    throw new Error('CONFIG: PAYPAL_ENV must be either sandbox or live.')
  }

  return environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
}

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim()
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim()

  if (
    !clientId ||
    !clientSecret ||
    clientId.startsWith('replace_with_') ||
    clientSecret.startsWith('replace_with_')
  ) {
    throw new Error('CONFIG: PayPal merchant credentials are not configured.')
  }

  return { clientId, clientSecret }
}

export function assertPayPalConfiguration() {
  getCredentials()
  const environment = process.env.PAYPAL_ENV?.trim() || 'sandbox'
  getPayPalBaseUrl()

  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim()
  if (!webhookId || webhookId.startsWith('replace_with_')) {
    throw new Error('CONFIG: PAYPAL_WEBHOOK_ID is not configured.')
  }

  return environment
}

export class PayPalApiError extends Error {
  constructor(message, status, responseBody) {
    super(message)
    this.name = 'PayPalApiError'
    this.status = status
    this.responseBody = responseBody
  }
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials()
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok || !body.access_token) {
    throw new PayPalApiError('PayPal authentication failed.', response.status, body)
  }

  return body.access_token
}

async function paypalRequest(path, options = {}) {
  const accessToken = await getAccessToken()
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const details = Array.isArray(body.details)
      ? body.details
          .map((item) => item.issue || item.description)
          .filter(Boolean)
          .join(' ')
      : ''
    throw new PayPalApiError(
      details || body.message || 'PayPal request failed.',
      response.status,
      body,
    )
  }

  return body
}

export function createPayPalOrder(order, requestId) {
  return paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'PayPal-Request-Id': requestId,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(order),
  })
}

export function capturePayPalOrder(orderId, localOrderId) {
  return paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      'PayPal-Request-Id': localOrderId,
      Prefer: 'return=representation',
    },
    body: '{}',
  })
}

export function getPayPalOrder(orderId) {
  return paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`, { method: 'GET' })
}

export async function verifyPayPalWebhook(headers, webhookEvent) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim()
  if (!webhookId || webhookId.startsWith('replace_with_')) {
    throw new Error('CONFIG: PAYPAL_WEBHOOK_ID is not configured.')
  }

  const requiredValues = [
    headers.authAlgo,
    headers.certUrl,
    headers.transmissionId,
    headers.transmissionSignature,
    headers.transmissionTime,
  ]
  if (requiredValues.some((value) => !value)) return false

  const verification = await paypalRequest('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify({
      auth_algo: headers.authAlgo,
      cert_url: headers.certUrl,
      transmission_id: headers.transmissionId,
      transmission_sig: headers.transmissionSignature,
      transmission_time: headers.transmissionTime,
      webhook_event: webhookEvent,
      webhook_id: webhookId,
    }),
  })

  return verification.verification_status === 'SUCCESS'
}
