import { requireAdminSession } from '../_lib/admin-auth.js'
import { requireGet, sendJson } from '../_lib/http.js'
import { listAdminOrders } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (!requireGet(req, res) || !requireAdminSession(req, res)) return
  try {
    const orders = await listAdminOrders()
    const paidOrders = orders.filter((order) => order.payment_status === 'paid')
    return sendJson(res, 200, {
      metrics: {
        paidOrders: paidOrders.length,
        pendingFulfillment: paidOrders.filter((order) =>
          ['unfulfilled', 'processing'].includes(order.fulfillment_status),
        ).length,
        shippedOrders: orders.filter((order) => order.fulfillment_status === 'shipped').length,
        totalOrders: orders.length,
        totalRevenue: paidOrders.reduce((sum, order) => sum + order.total_amount, 0),
      },
    })
  } catch (error) {
    console.error('Unable to load admin dashboard.', error)
    return sendJson(res, 500, { error: 'Unable to load dashboard.' })
  }
}
