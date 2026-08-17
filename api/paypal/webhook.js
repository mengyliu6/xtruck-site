import { publicError, readJsonBody, requirePost, sendJson } from '../_lib/http.js'
import { verifyPayPalWebhook } from '../_lib/paypal.js'
import { registerPaymentEvent, updateOrderByProviderOrderId } from '../_lib/supabase.js'

const statusByEventType = {
  'CHECKOUT.ORDER.APPROVED': 'approved',
  'PAYMENT.CAPTURE.COMPLETED': 'paid',
  'PAYMENT.CAPTURE.DENIED': 'failed',
  'PAYMENT.CAPTURE.REFUNDED': 'refunded',
  'CUSTOMER.DISPUTE.CREATED': 'disputed',
}

function findOrderId(event) {
  return (
    event.resource?.supplementary_data?.related_ids?.order_id ||
    (event.event_type === 'CHECKOUT.ORDER.APPROVED' ? event.resource?.id : null)
  )
}

export default async function handler(request, response) {
  if (!requirePost(request, response)) return

  try {
    const event = readJsonBody(request)
    const verified = await verifyPayPalWebhook(request.headers, event)
    if (!verified) {
      sendJson(response, 400, { error: 'Invalid PayPal webhook signature.' })
      return
    }

    const isNewEvent = await registerPaymentEvent({
      provider_event_id: event.id,
      provider: 'paypal',
      event_type: event.event_type,
      payload: event,
    })

    if (!isNewEvent) {
      sendJson(response, 200, { received: true, duplicate: true })
      return
    }

    const orderId = findOrderId(event)
    const paymentStatus = statusByEventType[event.event_type]

    if (orderId && paymentStatus) {
      await updateOrderByProviderOrderId(orderId, {
        payment_status: paymentStatus,
        provider_capture_id:
          event.resource?.supplementary_data?.related_ids?.capture_id ||
          (event.event_type.startsWith('PAYMENT.CAPTURE.') ? event.resource?.id : null),
        paid_at:
          paymentStatus === 'paid'
            ? event.resource?.create_time || new Date().toISOString()
            : undefined,
        raw_provider_data: event,
      })
    }

    sendJson(response, 200, { received: true })
  } catch (error) {
    const result = publicError(error, 'Webhook processing failed.')
    sendJson(response, result.status, { error: result.message })
  }
}
