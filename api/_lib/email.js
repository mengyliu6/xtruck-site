import { findEmailTemplate, updateOrder } from './supabase.js'

export const EMAIL_TEMPLATE_KEYS = Object.freeze(['order_confirmation', 'shipping_update'])

export const DEFAULT_EMAIL_TEMPLATES = Object.freeze({
  order_confirmation: {
    key: 'order_confirmation',
    subject: 'Xtruck order confirmation - {{order_number}}',
    body: `Hello {{customer_name}},

Thank you for your Xtruck order.

Order Number: {{order_number}}
Product: {{product_name}}
Quantity: {{quantity}}
Total: {{total}}
Payment Status: {{payment_status}}
Fulfillment Status: {{fulfillment_status}}

View your order status: {{order_status_url}}

Xtruck`,
  },
  shipping_update: {
    key: 'shipping_update',
    subject: 'Your Xtruck order has shipped - {{order_number}}',
    body: `Hello {{customer_name}},

Your Xtruck order has shipped.

Order Number: {{order_number}}
Shipping Carrier: {{shipping_carrier}}
Tracking Number: {{tracking_number}}
Fulfillment Status: {{fulfillment_status}}

View your order status: {{order_status_url}}

Xtruck`,
  },
})

function formatMoney(cents, currency) {
  return new Intl.NumberFormat('en-US', { currency, style: 'currency' }).format(cents / 100)
}

function templateVariables(order) {
  const baseUrl = (process.env.VITE_CANONICAL_URL || 'https://www.xtruckohw808.com/').replace(
    /\/$/,
    '',
  )
  return {
    customer_name: order.customer_name || 'Customer',
    fulfillment_status: order.fulfillment_status || '',
    order_number: order.order_number || '',
    order_status_url: `${baseUrl}/order-status?order=${encodeURIComponent(order.order_number)}`,
    payment_status: order.payment_status || '',
    product_name: order.product_name || '',
    quantity: String(order.quantity || ''),
    shipping_carrier: order.shipping_carrier || '',
    total: formatMoney(order.total_amount, order.currency),
    tracking_number: order.tracking_number || '',
  }
}

function renderTemplate(value, variables) {
  return value.replace(/{{\s*([a-z_]+)\s*}}/g, (match, key) => variables[key] ?? match)
}

async function getTemplate(key) {
  return (await findEmailTemplate(key)) || DEFAULT_EMAIL_TEMPLATES[key]
}

async function sendEmail({ idempotencyKey, subject, text, to }) {
  const apiKey = process.env.RESEND_API_KEY?.trim() || ''
  const from = process.env.ORDER_EMAIL_FROM?.trim() || ''
  if (!apiKey || !from) throw new Error('CONFIG: Resend email is not configured.')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from, subject, text, to: [to] }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend request failed (${response.status}): ${body.slice(0, 200)}`)
  }
}

async function sendOrderEmail(order, key, timestampField) {
  if (!order.customer_email || order[timestampField]) return order
  const template = await getTemplate(key)
  const variables = templateVariables(order)
  await sendEmail({
    idempotencyKey: `xtruck-${key}-${order.id}`,
    subject: renderTemplate(template.subject, variables),
    text: renderTemplate(template.body, variables),
    to: order.customer_email,
  })
  return updateOrder(order.id, { [timestampField]: new Date().toISOString() })
}

export function sendOrderConfirmationIfNeeded(order) {
  if (order.payment_status !== 'paid') return Promise.resolve(order)
  return sendOrderEmail(order, 'order_confirmation', 'confirmation_email_sent_at')
}

export function sendShippingUpdateIfNeeded(order) {
  if (order.fulfillment_status !== 'shipped' || !order.shipping_carrier || !order.tracking_number) {
    return Promise.resolve(order)
  }
  return sendOrderEmail(order, 'shipping_update', 'shipping_email_sent_at')
}
