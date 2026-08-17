import { requirePost, publicError, readJsonBody, sendJson } from '../_lib/http.js'
import { createOrderNumber, getAmounts, normalizeQuantity, PRODUCT } from '../_lib/orders.js'
import { insertOrder } from '../_lib/supabase.js'

function cleanString(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default async function handler(request, response) {
  if (!requirePost(request, response)) return

  if (process.env.BANK_TRANSFER_ENABLED !== 'true') {
    sendJson(response, 503, { error: 'Bank transfer ordering is not enabled.' })
    return
  }

  try {
    const body = readJsonBody(request)
    const quantity = normalizeQuantity(body.quantity)
    const customer = {
      name: cleanString(body.name, 120),
      email: cleanString(body.email, 200),
      phone: cleanString(body.phone, 80),
      company: cleanString(body.company, 160),
      country: cleanString(body.country, 120),
      address: cleanString(body.address, 500),
    }

    if (
      !customer.name ||
      !validEmail(customer.email) ||
      !customer.phone ||
      !customer.country ||
      !customer.address
    ) {
      sendJson(response, 400, { error: 'Please complete all required customer details.' })
      return
    }

    const amounts = getAmounts(quantity)
    const orderNumber = createOrderNumber()

    await insertOrder({
      order_number: orderNumber,
      provider: 'manual',
      payment_method: 'bank_transfer',
      sku: PRODUCT.sku,
      product_name: PRODUCT.name,
      quantity,
      currency: PRODUCT.currency,
      unit_amount: amounts.unitAmount,
      subtotal_amount: amounts.subtotalAmount,
      shipping_amount: amounts.shippingAmount,
      total_amount: amounts.totalAmount,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      company_name: customer.company || null,
      shipping_address: {
        country: customer.country,
        address_line: customer.address,
      },
      payment_status: 'awaiting_bank_transfer',
      fulfillment_status: 'unfulfilled',
    })

    const whatsappNumber = process.env.WHATSAPP_NUMBER || '8613360519239'
    const message = encodeURIComponent(
      `Hello, I submitted a Hong Kong bank transfer request for ${PRODUCT.name}.\n\nOrder: ${orderNumber}\nName: ${customer.name}\nQuantity: ${quantity}\nCountry: ${customer.country}\n\nPlease send me the verified bank details.`,
    )

    sendJson(response, 201, {
      orderNumber,
      whatsappUrl: `https://wa.me/${whatsappNumber}?text=${message}`,
    })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Quantity')) {
      sendJson(response, 400, { error: error.message })
      return
    }
    const result = publicError(
      error,
      'Could not create the transfer request. Please contact Xtruck.',
    )
    sendJson(response, result.status, { error: result.message })
  }
}
