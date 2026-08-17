import { randomUUID } from 'node:crypto'

export const PRODUCT = Object.freeze({
  currency: 'USD',
  name: 'Xtruck OHW808',
  sku: 'XTRUCK-OHW808',
})

function usdStringToCents(value, variableName, { allowZero = false } = {}) {
  const normalized = String(value).trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`CONFIG: ${variableName} must be a USD amount with up to two decimals.`)
  }

  const [whole, fraction = ''] = normalized.split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  if (!Number.isSafeInteger(cents) || (allowZero ? cents < 0 : cents <= 0)) {
    throw new Error(`CONFIG: ${variableName} is outside the supported range.`)
  }
  return cents
}

export function getProductAmounts(quantity) {
  const unitPrice = usdStringToCents(process.env.PRODUCT_PRICE_USD || '2399', 'PRODUCT_PRICE_USD')
  const shippingAmount = usdStringToCents(
    process.env.PRODUCT_SHIPPING_USD || '0',
    'PRODUCT_SHIPPING_USD',
    { allowZero: true },
  )
  const subtotal = unitPrice * quantity

  if (!Number.isSafeInteger(subtotal)) {
    throw new Error('CONFIG: Calculated product total is outside the supported range.')
  }

  return {
    shippingAmount,
    subtotal,
    totalAmount: subtotal + shippingAmount,
    unitPrice,
  }
}

export function normalizeQuantity(value) {
  const quantity = Number(value)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
    throw new Error('VALIDATION: Quantity must be an integer between 1 and 5.')
  }
  return quantity
}

export function normalizeRequestId(value) {
  const requestId = typeof value === 'string' ? value.trim() : ''
  if (!/^[A-Za-z0-9_-]{16,38}$/.test(requestId)) {
    throw new Error('VALIDATION: A valid checkout request ID is required.')
  }
  return requestId
}

export function normalizePayPalOrderId(value) {
  const orderId = typeof value === 'string' ? value.trim().toUpperCase() : ''
  if (!/^[A-Z0-9]{1,36}$/.test(orderId)) {
    throw new Error('VALIDATION: A valid PayPal order ID is required.')
  }
  return orderId
}

export function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  return `XTK-${date}-${randomUUID().slice(0, 8).toUpperCase()}`
}

export function centsToPayPalValue(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error('Invalid integer-cent amount.')
  }
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`
}

export function payPalValueToCents(value) {
  const normalized = String(value ?? '').trim()
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null
  const [whole, fraction = ''] = normalized.split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : null
}
