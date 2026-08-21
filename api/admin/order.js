import { requireAdminSession } from '../_lib/admin-auth.js'
import { sendShippingUpdateIfNeeded } from '../_lib/email.js'
import { readJsonBody, sendJson } from '../_lib/http.js'
import { findAdminOrderById, updateOrder } from '../_lib/supabase.js'

const FULFILLMENT_STATUSES = new Set([
  'unfulfilled',
  'processing',
  'shipped',
  'completed',
  'cancelled',
])

function getId(req) {
  const id = String(req.query?.id || '')
    .trim()
    .toLowerCase()
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/.test(id) ? id : ''
}

export default async function handler(req, res) {
  if (!requireAdminSession(req, res)) return
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  try {
    const id = getId(req)
    if (!id) return sendJson(res, 404, { error: 'Order not found.' })
    let order = await findAdminOrderById(id)
    if (!order) return sendJson(res, 404, { error: 'Order not found.' })
    if (req.method === 'GET') return sendJson(res, 200, { order })

    const body = readJsonBody(req)
    const fulfillmentStatus = String(body.fulfillmentStatus || '')
    const shippingCarrier =
      String(body.shippingCarrier || '')
        .trim()
        .slice(0, 120) || null
    const trackingNumber =
      String(body.trackingNumber || '')
        .trim()
        .slice(0, 160) || null
    if (!FULFILLMENT_STATUSES.has(fulfillmentStatus)) {
      return sendJson(res, 400, { error: 'Select a valid fulfillment status.' })
    }
    if (fulfillmentStatus === 'shipped' && (!shippingCarrier || !trackingNumber)) {
      return sendJson(res, 400, {
        error: 'Shipping carrier and tracking number are required for shipped orders.',
      })
    }

    order = await updateOrder(order.id, {
      fulfillment_status: fulfillmentStatus,
      shipping_carrier: shippingCarrier,
      tracking_number: trackingNumber,
    })

    try {
      order = await sendShippingUpdateIfNeeded(order)
    } catch (emailError) {
      console.error('Unable to send shipping update email.', emailError)
    }

    order = await findAdminOrderById(order.id)
    return sendJson(res, 200, { order })
  } catch (error) {
    console.error('Unable to update admin order.', error)
    return sendJson(res, 500, { error: 'Unable to update order.' })
  }
}
