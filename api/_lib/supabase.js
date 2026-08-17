function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('CONFIG: Supabase order storage is not configured.')
  }

  return { url: url.replace(/\/+$/, ''), serviceRoleKey }
}

async function supabaseRequest(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    const error = new Error(`Database request failed (${response.status}).`)
    error.status = response.status
    error.details = body
    throw error
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function insertOrder(order) {
  const rows = await supabaseRequest('orders', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(order),
  })
  return rows?.[0]
}

export async function getOrderByProviderOrderId(providerOrderId) {
  const query = new URLSearchParams({
    select: '*',
    provider_order_id: `eq.${providerOrderId}`,
    limit: '1',
  })
  const rows = await supabaseRequest(`orders?${query.toString()}`, { method: 'GET' })
  return rows?.[0] || null
}

export async function updateOrderByProviderOrderId(providerOrderId, updates) {
  const query = new URLSearchParams({ provider_order_id: `eq.${providerOrderId}` })
  const rows = await supabaseRequest(`orders?${query.toString()}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
  })
  return rows?.[0] || null
}

export async function registerPaymentEvent(event) {
  try {
    await supabaseRequest('payment_events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(event),
    })
    return true
  } catch (error) {
    if (error && error.status === 409) return false
    throw error
  }
}
