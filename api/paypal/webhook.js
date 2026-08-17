import {
  getRequestHeader,
  handleApiError,
  readJsonBody,
  requirePost,
  sendJson,
} from '../_lib/http.js'
import { payPalValueToCents } from '../_lib/orders.js'
import { verifyPayPalWebhook } from '../_lib/paypal.js'
import {
  claimPaymentEvent,
  completePaymentEvent,
  findPaymentEventByProviderEventId,
  findOrderByPayPalCaptureId,
  findOrderByPayPalOrderId,
  releasePaymentEvent,
  updateOrder,
} from '../_lib/supabase.js'

const ORDER_APPROVED = 'CHECKOUT.ORDER.APPROVED'
const CAPTURE_COMPLETED = 'PAYMENT.CAPTURE.COMPLETED'
const CAPTURE_DENIED = 'PAYMENT.CAPTURE.DENIED'
const CAPTURE_REFUNDED = 'PAYMENT.CAPTURE.REFUNDED'
const DISPUTE_CREATED = 'CUSTOMER.DISPUTE.CREATED'

function getVerificationHeaders(req) {
  return {
    authAlgo: getRequestHeader(req, 'paypal-auth-algo'),
    certUrl: getRequestHeader(req, 'paypal-cert-url'),
    transmissionId: getRequestHeader(req, 'paypal-transmission-id'),
    transmissionSignature: getRequestHeader(req, 'paypal-transmission-sig'),
    transmissionTime: getRequestHeader(req, 'paypal-transmission-time'),
  }
}

async function findWebhookOrder(event) {
  const resource = event.resource || {}
  const orderId =
    event.event_type === ORDER_APPROVED
      ? resource.id
      : resource.supplementary_data?.related_ids?.order_id
  if (orderId) return findOrderByPayPalOrderId(orderId)

  const captureId =
    resource.supplementary_data?.related_ids?.capture_id ||
    resource.disputed_transactions?.[0]?.seller_transaction_id ||
    (event.event_type === CAPTURE_COMPLETED || event.event_type === CAPTURE_DENIED
      ? resource.id
      : null)
  return captureId ? findOrderByPayPalCaptureId(captureId) : null
}

function mergeRawEvent(order, event) {
  const current =
    order.raw_payment_data && typeof order.raw_payment_data === 'object'
      ? order.raw_payment_data
      : {}
  return { ...current, latest_webhook: event }
}

async function processWebhookEvent(event, order) {
  if (!order) return null

  if (event.event_type === ORDER_APPROVED) {
    if (!['paid', 'refunded', 'review'].includes(order.payment_status)) {
      return updateOrder(order.id, {
        payment_status: 'approved',
        raw_payment_data: mergeRawEvent(order, event),
      })
    }
    return order
  }

  if (event.event_type === CAPTURE_COMPLETED) {
    const capture = event.resource || {}
    const amountMatches = payPalValueToCents(capture.amount?.value) === order.total_amount
    const currencyMatches = capture.amount?.currency_code === order.currency
    const linkedOrderId = capture.supplementary_data?.related_ids?.order_id
    const orderMatches = !linkedOrderId || linkedOrderId === order.paypal_order_id
    const captureCompleted = capture.status === 'COMPLETED'
    const paymentStatus =
      amountMatches && currencyMatches && orderMatches && captureCompleted ? 'paid' : 'review'

    if (order.payment_status === 'refunded') return order

    return updateOrder(order.id, {
      payment_status: paymentStatus,
      paypal_capture_id: capture.id || order.paypal_capture_id,
      raw_payment_data: mergeRawEvent(order, event),
    })
  }

  if (event.event_type === CAPTURE_DENIED) {
    if (!['paid', 'refunded', 'review'].includes(order.payment_status)) {
      return updateOrder(order.id, {
        payment_status: 'failed',
        raw_payment_data: mergeRawEvent(order, event),
      })
    }
    return order
  }

  if (event.event_type === CAPTURE_REFUNDED) {
    return updateOrder(order.id, {
      payment_status: 'refunded',
      raw_payment_data: mergeRawEvent(order, event),
    })
  }

  if (event.event_type === DISPUTE_CREATED) return order
  return order
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return

  let claimedEvent = null
  try {
    const event = readJsonBody(req)
    if (!event?.id || !event?.event_type) {
      return sendJson(res, 400, { error: 'Invalid PayPal webhook event.' })
    }

    const verified = await verifyPayPalWebhook(getVerificationHeaders(req), event)
    if (!verified) return sendJson(res, 400, { error: 'Invalid PayPal webhook signature.' })

    claimedEvent = await claimPaymentEvent({
      event_type: event.event_type,
      payload: event,
      provider: 'paypal',
      provider_event_id: event.id,
    })
    if (!claimedEvent) {
      const existingEvent = await findPaymentEventByProviderEventId(event.id)
      if (existingEvent?.processed_at) {
        return sendJson(res, 200, { duplicate: true, received: true })
      }

      return sendJson(res, 409, {
        error: 'This PayPal webhook event is already being processed.',
      })
    }

    const order = await findWebhookOrder(event)
    const updatedOrder = await processWebhookEvent(event, order)
    await completePaymentEvent(claimedEvent.id, updatedOrder?.id || order?.id || null)

    return sendJson(res, 200, { received: true })
  } catch (error) {
    if (claimedEvent?.id) {
      try {
        await releasePaymentEvent(claimedEvent.id)
      } catch (releaseError) {
        console.error('Unable to release failed webhook event claim.', releaseError)
      }
    }
    return handleApiError(res, error, 'Unable to process the PayPal webhook.')
  }
}
