import { requireAdminSession } from '../_lib/admin-auth.js'
import { requireGet, sendJson } from '../_lib/http.js'
import { listAdminOrders } from '../_lib/supabase.js'

const PAYMENT_STATUSES = new Set([
  'pending',
  'approved',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'review',
])
const FULFILLMENT_STATUSES = new Set([
  'unfulfilled',
  'processing',
  'shipped',
  'completed',
  'cancelled',
])

export default async function handler(req, res) {
  if (!requireGet(req, res) || !requireAdminSession(req, res)) return
  try {
    const search = String(req.query?.search || '')
      .trim()
      .toLowerCase()
      .slice(0, 120)
    const paymentStatus = String(req.query?.paymentStatus || '')
    const fulfillmentStatus = String(req.query?.fulfillmentStatus || '')
    let orders = await listAdminOrders()

    if (search) {
      orders = orders.filter(
        (order) =>
          order.order_number.toLowerCase().includes(search) ||
          String(order.customer_email || '')
            .toLowerCase()
            .includes(search),
      )
    }
    if (PAYMENT_STATUSES.has(paymentStatus)) {
      orders = orders.filter((order) => order.payment_status === paymentStatus)
    }
    if (FULFILLMENT_STATUSES.has(fulfillmentStatus)) {
      orders = orders.filter((order) => order.fulfillment_status === fulfillmentStatus)
    }

    return sendJson(res, 200, { orders })
  } catch (error) {
    console.error('Unable to load admin orders.', error)
    return sendJson(res, 500, { error: 'Unable to load orders.' })
  }
}
