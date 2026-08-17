import { requirePost, publicError, readJsonBody, sendJson } from '../_lib/http.js'
import {
  centsToPayPalValue,
  createOrderNumber,
  getAmounts,
  normalizeQuantity,
  PRODUCT,
} from '../_lib/orders.js'
import { createPayPalOrder } from '../_lib/paypal.js'
import { insertOrder } from '../_lib/supabase.js'

export default async function handler(request, response) {
  if (!requirePost(request, response)) return

  try {
    const body = readJsonBody(request)
    const quantity = normalizeQuantity(body.quantity)
    const amounts = getAmounts(quantity)
    const orderNumber = createOrderNumber()
    const breakdown = {
      item_total: {
        currency_code: PRODUCT.currency,
        value: centsToPayPalValue(amounts.subtotalAmount),
      },
    }

    if (amounts.shippingAmount > 0) {
      breakdown.shipping = {
        currency_code: PRODUCT.currency,
        value: centsToPayPalValue(amounts.shippingAmount),
      }
    }

    const paypalOrder = await createPayPalOrder({
      orderNumber,
      order: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderNumber,
            custom_id: orderNumber,
            invoice_id: orderNumber,
            description: PRODUCT.name,
            amount: {
              currency_code: PRODUCT.currency,
              value: centsToPayPalValue(amounts.totalAmount),
              breakdown,
            },
            items: [
              {
                name: PRODUCT.name,
                sku: PRODUCT.sku,
                quantity: String(quantity),
                category: 'PHYSICAL_GOODS',
                unit_amount: {
                  currency_code: PRODUCT.currency,
                  value: centsToPayPalValue(amounts.unitAmount),
                },
              },
            ],
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'Xtruck',
              shipping_preference: 'GET_FROM_FILE',
              user_action: 'PAY_NOW',
            },
          },
        },
      },
    })

    await insertOrder({
      order_number: orderNumber,
      provider: 'paypal',
      provider_order_id: paypalOrder.id,
      payment_method: 'paypal',
      sku: PRODUCT.sku,
      product_name: PRODUCT.name,
      quantity,
      currency: PRODUCT.currency,
      unit_amount: amounts.unitAmount,
      subtotal_amount: amounts.subtotalAmount,
      shipping_amount: amounts.shippingAmount,
      total_amount: amounts.totalAmount,
      payment_status: 'pending',
      fulfillment_status: 'unfulfilled',
      raw_provider_data: paypalOrder,
    })

    sendJson(response, 201, { id: paypalOrder.id })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Quantity')) {
      sendJson(response, 400, { error: error.message })
      return
    }
    const result = publicError(error, 'Could not start PayPal checkout. Please contact Xtruck.')
    sendJson(response, result.status, { error: result.message })
  }
}
