function getSupabaseConfiguration() {
  const baseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, '')
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim()

  if (
    !baseUrl ||
    !secretKey ||
    baseUrl.startsWith('replace_with_') ||
    secretKey.startsWith('replace_with_')
  ) {
    throw new Error('CONFIG: Supabase server credentials are not configured.')
  }

  if (!secretKey.startsWith('sb_secret_')) {
    throw new Error('CONFIG: SUPABASE_SECRET_KEY must use the sb_secret_ format.')
  }

  return { baseUrl, secretKey }
}

export function assertSupabaseConfiguration() {
  getSupabaseConfiguration()
}

async function supabaseRequest(resource, options = {}) {
  const { baseUrl, secretKey } = getSupabaseConfiguration()
  const response = await fetch(`${baseUrl}/rest/v1/${resource}`, {
    ...options,
    headers: {
      apikey: secretKey,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const body = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(body?.message || 'Supabase request failed.')
    error.status = response.status
    error.code = body?.code
    throw error
  }

  return body
}

function filteredResource(table, column, value, extra = {}) {
  const query = new URLSearchParams({
    [column]: `eq.${value}`,
    ...extra,
  })
  return `${table}?${query.toString()}`
}

async function findOne(table, column, value) {
  const rows = await supabaseRequest(
    filteredResource(table, column, value, { limit: '1', select: '*' }),
  )
  return Array.isArray(rows) ? rows[0] || null : null
}

export function findOrderByClientRequestId(requestId) {
  return findOne('orders', 'client_request_id', requestId)
}

export function findOrderByPayPalOrderId(orderId) {
  return findOne('orders', 'paypal_order_id', orderId)
}

export function findOrderByPayPalCaptureId(captureId) {
  return findOne('orders', 'paypal_capture_id', captureId)
}

export function findPaymentEventByProviderEventId(eventId) {
  return findOne('payment_events', 'provider_event_id', eventId)
}

export async function insertOrder(order) {
  const rows = await supabaseRequest('orders', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(order),
  })
  if (!Array.isArray(rows) || !rows[0]) throw new Error('Supabase did not return the order.')
  return rows[0]
}

export async function updateOrder(id, updates) {
  const rows = await supabaseRequest(filteredResource('orders', 'id', id, { select: '*' }), {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(updates),
  })
  if (!Array.isArray(rows) || !rows[0]) throw new Error('Order update did not return a row.')
  return rows[0]
}

export async function claimPaymentEvent(event) {
  try {
    const rows = await supabaseRequest('payment_events', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(event),
    })
    return Array.isArray(rows) ? rows[0] || null : null
  } catch (error) {
    if (error?.status === 409 || error?.code === '23505') return null
    throw error
  }
}

export function completePaymentEvent(id, orderId) {
  return supabaseRequest(filteredResource('payment_events', 'id', id, { select: 'id' }), {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ order_id: orderId || null, processed_at: new Date().toISOString() }),
  })
}

export function releasePaymentEvent(id) {
  return supabaseRequest(filteredResource('payment_events', 'id', id, { select: 'id' }), {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  })
}
