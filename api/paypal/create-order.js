import { handleApiError, readJsonBody, requirePost, sendJson } from '../_lib/http.js'
import {
  PRODUCT,
  centsToPayPalValue,
  createOrderNumber,
  getProductAmounts,
  normalizeQuantity,
  normalizeRequestId,
} from '../_lib/orders.js'
import { createPayPalOrder } from '../_lib/paypal.js'
import { findOrderByClientRequestId, insertOrder, updateOrder } from '../_lib/supabase.js'

function buildPayPalOrder(localOrder) {
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          breakdown: {
            item_total: {
              currency_code: PRODUCT.currency,
              value: centsToPayPalValue(localOrder.subtotal),
            },
            shipping: {
              currency_code: PRODUCT.currency,
              value: centsToPayPalValue(localOrder.shipping_amount),
            },
          },
          currency_code: PRODUCT.currency,
          value: centsToPayPalValue(localOrder.total_amount),
        },
        custom_id: localOrder.id,
        description: PRODUCT.name,
        invoice_id: localOrder.order_number,
        items: [
          {
            name: PRODUCT.name,
            quantity: String(localOrder.quantity),
            sku: PRODUCT.sku,
            unit_amount: {
              currency_code: PRODUCT.currency,
              value: centsToPayPalValue(localOrder.unit_price),
            },
          },
        ],
        reference_id: localOrder.order_number,
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
  }
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return

  try {
    const body = readJsonBody(req)
    const quantity = normalizeQuantity(body.quantity)
    const requestId = normalizeRequestId(body.requestId)
    const amounts = getProductAmounts(quantity)
    let localOrder = await findOrderByClientRequestId(requestId)

    if (localOrder?.paypal_order_id) {
      if (['pending', 'approved'].includes(localOrder.payment_status)) {
        return sendJson(res, 200, {
          orderNumber: localOrder.order_number,
          paypalOrderId: localOrder.paypal_order_id,
        })
      }

      throw new Error('VALIDATION: This checkout attempt is closed. Please start a new payment.')
    }

    if (localOrder && localOrder.quantity !== quantity) {
      throw new Error('VALIDATION: Checkout quantity changed. Please start a new payment attempt.')
    }

    if (!localOrder) {
      try {
        localOrder = await insertOrder({
          client_request_id: requestId,
          currency: PRODUCT.currency,
          fulfillment_status: 'unfulfilled',
          order_number: createOrderNumber(),
          payment_provider: 'paypal',
          payment_status: 'pending',
          product_name: PRODUCT.name,
          product_sku: PRODUCT.sku,
          quantity,
          raw_payment_data: {},
          shipping_amount: amounts.shippingAmount,
          subtotal: amounts.subtotal,
          total_amount: amounts.totalAmount,
          unit_price: amounts.unitPrice,
        })
      } catch (error) {
        if (error?.status === 409 || error?.code === '23505') {
          localOrder = await findOrderByClientRequestId(requestId)
        } else {
          throw error
        }
      }
    }

    if (!localOrder) throw new Error('Unable to initialize the order record.')

    const paypalOrder = await createPayPalOrder(buildPayPalOrder(localOrder), requestId)
    if (!paypalOrder?.id) throw new Error('PayPal did not return an order ID.')

    localOrder = await updateOrder(localOrder.id, {
      paypal_order_id: paypalOrder.id,
      raw_payment_data: { create_order: paypalOrder },
    })

    return sendJson(res, 201, {
      currency: localOrder.currency,
      orderNumber: localOrder.order_number,
      paypalOrderId: localOrder.paypal_order_id,
      totalAmount: localOrder.total_amount,
    })
  } catch (error) {
    return handleApiError(res, error, 'Unable to create the PayPal order.')
  }
}
