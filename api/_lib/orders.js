import { randomUUID } from 'node:crypto'

export const PRODUCT = {
  sku: 'XTRUCK-OHW808',
  name: 'Xtruck OHW808',
  currency: 'USD',
}

export function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  return `XTK-${date}-${randomUUID().slice(0, 8).toUpperCase()}`
}

export function normalizeQuantity(value) {
  const quantity = Number(value)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
    throw new Error('Quantity must be between 1 and 5.')
  }
  return quantity
}

export function getAmounts(quantity) {
  const unitPrice = Number(process.env.PRODUCT_PRICE_USD || '2399')
  const shippingPrice = Number(process.env.PRODUCT_SHIPPING_USD || '0')

  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    throw new Error('CONFIG: PRODUCT_PRICE_USD must be a positive number.')
  }

  if (!Number.isFinite(shippingPrice) || shippingPrice < 0) {
    throw new Error('CONFIG: PRODUCT_SHIPPING_USD cannot be negative.')
  }

  const unitAmount = Math.round(unitPrice * 100)
  const shippingAmount = Math.round(shippingPrice * 100)
  const subtotalAmount = unitAmount * quantity

  return {
    unitAmount,
    shippingAmount,
    subtotalAmount,
    totalAmount: subtotalAmount + shippingAmount,
  }
}

export function centsToPayPalValue(cents) {
  return (cents / 100).toFixed(2)
}

export function payPalValueToCents(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return null
  return Math.round(amount * 100)
}
