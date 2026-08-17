import { handleApiError, readJsonBody, requirePost, sendJson } from '../_lib/http.js'
import { payPalValueToCents, normalizePayPalOrderId } from '../_lib/orders.js'
import { PayPalApiError, capturePayPalOrder, getPayPalOrder } from '../_lib/paypal.js'
import { findOrderByPayPalOrderId, updateOrder } from '../_lib/supabase.js'

function getCapture(paypalOrder) {
  return paypalOrder?.purchase_units
    ?.flatMap((unit) => unit.payments?.captures || [])
    .find((capture) => capture?.id)
}

function getCustomerDetails(paypalOrder) {
  const paypal = paypalOrder?.payment_source?.paypal || {}
  const name = [paypal.name?.given_name, paypal.name?.surname].filter(Boolean).join(' ')
  const shipping = paypalOrder?.purchase_units?.find((unit) => unit.shipping)?.shipping || null

  return {
    customer_email: paypal.email_address || null,
    customer_name: name || null,
    customer_phone: paypal.phone?.phone_number?.national_number || null,
    shipping_address: shipping || null,
    shipping_country: shipping?.address?.country_code || null,
  }
}

function getPaymentStatus(paypalOrder, capture, localOrder) {
  const purchaseUnit = paypalOrder?.purchase_units?.[0]
  const amount = payPalValueToCents(capture?.amount?.value)
  const amountMatches = amount === localOrder.total_amount
  const currencyMatches = capture?.amount?.currency_code === localOrder.currency
  const orderMatches =
    paypalOrder?.id === localOrder.paypal_order_id &&
    purchaseUnit?.custom_id === localOrder.id &&
    purchaseUnit?.invoice_id === localOrder.order_number
  const itemMatches =
    purchaseUnit?.items?.[0]?.sku === localOrder.product_sku &&
    Number(purchaseUnit?.items?.[0]?.quantity) === localOrder.quantity

  if (!amountMatches || !currencyMatches || !orderMatches || !itemMatches) return 'review'
  if (capture?.status === 'COMPLETED' && paypalOrder?.status === 'COMPLETED') return 'paid'
  if (['DECLINED', 'DENIED', 'FAILED'].includes(capture?.status)) return 'failed'
  return 'approved'
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return

  try {
    const orderId = normalizePayPalOrderId(readJsonBody(req).orderId)
    let localOrder = await findOrderByPayPalOrderId(orderId)
    if (!localOrder) return sendJson(res, 404, { error: 'Order not found.' })

    if (['paid', 'refunded'].includes(localOrder.payment_status)) {
      return sendJson(res, 200, {
        orderNumber: localOrder.order_number,
        paymentStatus: localOrder.payment_status,
      })
    }

    let paypalOrder
    try {
      paypalOrder = await capturePayPalOrder(orderId, localOrder.id)
    } catch (error) {
      const issues = error instanceof PayPalApiError ? error.responseBody?.details || [] : []
      const alreadyCaptured = issues.some((item) => item.issue === 'ORDER_ALREADY_CAPTURED')
      if (!alreadyCaptured) throw error
      paypalOrder = await getPayPalOrder(orderId)
    }

    const capture = getCapture(paypalOrder)
    if (!capture) throw new Error('PayPal capture details are unavailable.')

    const paymentStatus = getPaymentStatus(paypalOrder, capture, localOrder)
    const existingRawData =
      localOrder.raw_payment_data && typeof localOrder.raw_payment_data === 'object'
        ? localOrder.raw_payment_data
        : {}

    localOrder = await updateOrder(localOrder.id, {
      ...getCustomerDetails(paypalOrder),
      payment_status: paymentStatus,
      paypal_capture_id: capture.id,
      raw_payment_data: { ...existingRawData, capture_order: paypalOrder },
    })

    return sendJson(res, paymentStatus === 'paid' ? 200 : 202, {
      currency: localOrder.currency,
      orderNumber: localOrder.order_number,
      paymentStatus: localOrder.payment_status,
      totalAmount: localOrder.total_amount,
    })
  } catch (error) {
    return handleApiError(res, error, 'Unable to capture the PayPal payment.')
  }
}
