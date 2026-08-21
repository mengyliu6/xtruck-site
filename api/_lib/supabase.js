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

export async function supabaseRequest(resource, options = {}) {
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

async function findOne(table, column, value, select = '*') {
  const rows = await supabaseRequest(filteredResource(table, column, value, { limit: '1', select }))
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

export async function findPublicOrder(orderNumber, customerEmail) {
  const query = new URLSearchParams({
    order_number: `eq.${orderNumber}`,
    limit: '1',
    select:
      'order_number,product_name,quantity,currency,total_amount,payment_status,fulfillment_status,created_at,shipping_carrier,tracking_number,customer_email',
  })
  const rows = await supabaseRequest(`orders?${query.toString()}`)
  const order = Array.isArray(rows) ? rows[0] || null : null
  if (order?.customer_email?.toLowerCase() !== customerEmail) return null
  const publicOrder = { ...order }
  delete publicOrder.customer_email
  return publicOrder
}

export async function listAdminOrders() {
  const query = new URLSearchParams({
    limit: '500',
    order: 'created_at.desc',
    select:
      'id,order_number,customer_name,customer_email,shipping_country,product_name,quantity,currency,total_amount,payment_status,fulfillment_status,created_at',
  })
  const rows = await supabaseRequest(`orders?${query.toString()}`)
  return Array.isArray(rows) ? rows : []
}

export function findAdminOrderById(id) {
  return findOne(
    'orders',
    'id',
    id,
    'id,order_number,product_sku,product_name,quantity,currency,unit_price,subtotal,shipping_amount,total_amount,payment_provider,payment_status,fulfillment_status,paypal_order_id,paypal_capture_id,customer_name,customer_email,customer_phone,shipping_country,shipping_address,shipping_carrier,tracking_number,confirmation_email_sent_at,shipping_email_sent_at,created_at,updated_at',
  )
}

export function findEmailTemplate(key) {
  return findOne('email_templates', 'key', key, 'id,key,subject,body,updated_at')
}

export async function listEmailTemplates() {
  const rows = await supabaseRequest(
    'email_templates?select=id,key,subject,body,updated_at&order=key.asc',
  )
  return Array.isArray(rows) ? rows : []
}

export async function upsertEmailTemplate(template) {
  const rows = await supabaseRequest('email_templates?on_conflict=key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(template),
  })
  if (!Array.isArray(rows) || !rows[0]) throw new Error('Template update did not return a row.')
  return rows[0]
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
