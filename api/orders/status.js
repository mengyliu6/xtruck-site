import { readJsonBody, requirePost, sendJson } from '../_lib/http.js'
import { findPublicOrder } from '../_lib/supabase.js'

const NOT_FOUND_MESSAGE = 'Order not found. Please check your order number and email.'

function normalizeLookup(body) {
  const orderNumber =
    typeof body.orderNumber === 'string' ? body.orderNumber.trim().toUpperCase() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!/^XTK-[A-Z0-9-]{8,40}$/.test(orderNumber) || !/^\S+@\S+\.\S+$/.test(email)) {
    return null
  }

  return { email: email.slice(0, 254), orderNumber }
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return

  try {
    const lookup = normalizeLookup(readJsonBody(req))
    if (!lookup) return sendJson(res, 404, { error: NOT_FOUND_MESSAGE })

    const order = await findPublicOrder(lookup.orderNumber, lookup.email)
    if (!order) return sendJson(res, 404, { error: NOT_FOUND_MESSAGE })

    return sendJson(res, 200, { order })
  } catch (error) {
    console.error('Unable to retrieve customer order status.', error)
    return sendJson(res, 404, { error: NOT_FOUND_MESSAGE })
  }
}
