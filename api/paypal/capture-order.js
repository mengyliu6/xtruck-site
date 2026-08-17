import { requirePost, publicError, readJsonBody, sendJson } from '../_lib/http.js'
import { payPalValueToCents, PRODUCT } from '../_lib/orders.js'
import { capturePayPalOrder } from '../_lib/paypal.js'
import { getOrderByProviderOrderId, updateOrderByProviderOrderId } from '../_lib/supabase.js'

export default async function handler(request, response) {
  if (!requirePost(request, response)) return

  try {
    const body = readJsonBody(request)
    const orderId = typeof body.orderID === 'string' ? body.orderID.trim() : ''
    if (!orderId) {
      sendJson(response, 400, { error: 'A PayPal order ID is required.' })
      return
    }

    const storedOrder = await getOrderByProviderOrderId(orderId)
    if (!storedOrder) {
      sendJson(response, 404, { error: 'Order not found.' })
      return
    }

    if (storedOrder.payment_status === 'paid') {
      sendJson(response, 200, {
        orderNumber: storedOrder.order_number,
        status: storedOrder.payment_status,
      })
      return
    }

    const captureResult = await capturePayPalOrder(orderId)
    const purchaseUnit = captureResult.purchase_units?.[0]
    const capture = purchaseUnit?.payments?.captures?.[0]
    const paidAmount = payPalValueToCents(capture?.amount?.value)
    const currencyMatches = capture?.amount?.currency_code === PRODUCT.currency
    const amountMatches = paidAmount === storedOrder.total_amount
    const isCompleted = capture?.status === 'COMPLETED'
    const paymentStatus = isCompleted && currencyMatches && amountMatches ? 'paid' : 'review'
    const payerName = [captureResult.payer?.name?.given_name, captureResult.payer?.name?.surname]
      .filter(Boolean)
      .join(' ')

    const updatedOrder = await updateOrderByProviderOrderId(orderId, {
      payment_status: paymentStatus,
      provider_capture_id: capture?.id || null,
      customer_name: payerName || null,
      customer_email: captureResult.payer?.email_address || null,
      customer_phone: captureResult.payer?.phone?.phone_number?.national_number || null,
      shipping_address: purchaseUnit?.shipping || null,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
      raw_provider_data: captureResult,
    })

    sendJson(response, 200, {
      orderNumber: updatedOrder?.order_number || storedOrder.order_number,
      status: paymentStatus,
    })
  } catch (error) {
    const result = publicError(error, 'Could not confirm the payment. Please contact Xtruck.')
    sendJson(response, result.status, { error: result.message })
  }
}
