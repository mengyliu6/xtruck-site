function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('CONFIG: PayPal merchant credentials are not configured.')
  }

  return { clientId, clientSecret }
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
  const body = await response.json()

  if (!response.ok || !body.access_token) {
    throw new Error('PayPal authentication failed.')
  }

  return body.access_token
}

async function paypalRequest(path, options = {}) {
  const accessToken = await getAccessToken()
  const response = await fetch(`${getPayPalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const body = await response.json()

  if (!response.ok) {
    const details = Array.isArray(body.details)
      ? body.details
          .map((item) => item.description || item.issue)
          .filter(Boolean)
          .join(' ')
      : ''
    throw new Error(details || body.message || 'PayPal request failed.')
  }

  return body
}

export function createPayPalOrder(payload) {
  return paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    headers: { 'PayPal-Request-Id': payload.orderNumber },
    body: JSON.stringify(payload.order),
  })
}

export function capturePayPalOrder(orderId) {
  return paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: { 'PayPal-Request-Id': `capture-${orderId}` },
    body: '{}',
  })
}

export async function verifyPayPalWebhook(headers, webhookEvent) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    throw new Error('CONFIG: PAYPAL_WEBHOOK_ID is not configured.')
  }

  const verification = await paypalRequest('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  })

  return verification.verification_status === 'SUCCESS'
}
