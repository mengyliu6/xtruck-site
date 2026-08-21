<script setup lang="ts">
import { ref } from 'vue'

interface PublicOrder {
  order_number: string
  product_name: string
  quantity: number
  currency: string
  total_amount: number
  payment_status: string
  fulfillment_status: string
  created_at: string
  shipping_carrier: string | null
  tracking_number: string | null
}

const initialOrderNumber = new URLSearchParams(window.location.search).get('order') || ''
const orderNumber = ref(initialOrderNumber)
const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const order = ref<PublicOrder | null>(null)

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

function formatStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function findOrder() {
  loading.value = true
  errorMessage.value = ''
  order.value = null

  try {
    const response = await fetch('/api/orders/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber: orderNumber.value, email: email.value }),
    })
    const body = (await response.json().catch(() => ({}))) as {
      error?: string
      order?: PublicOrder
    }
    if (!response.ok || !body.order) {
      throw new Error(body.error || 'Order not found. Please check your order number and email.')
    }
    order.value = body.order
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Order not found. Please check your order number and email.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="order-status-page">
    <section class="section order-status-hero">
      <div class="section-shell order-status-layout">
        <div class="order-status-intro">
          <p class="eyebrow">Order Support</p>
          <h1>Check Your Order Status</h1>
          <p>Enter your Xtruck order number and the email used for your PayPal payment.</p>
        </div>

        <form class="order-status-form" @submit.prevent="findOrder">
          <label for="order-number">Order Number</label>
          <input
            id="order-number"
            v-model.trim="orderNumber"
            type="text"
            autocomplete="off"
            placeholder="XTK-YYYYMMDD-XXXXXXXX"
            required
          />
          <label for="paypal-email">PayPal Email</label>
          <input
            id="paypal-email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            placeholder="name@example.com"
            required
          />
          <button class="button button--primary" type="submit" :disabled="loading">
            {{ loading ? 'Checking...' : 'Check Order Status' }}
          </button>
          <p v-if="errorMessage" class="order-status-error" role="alert">{{ errorMessage }}</p>
        </form>
      </div>
    </section>

    <section v-if="order" class="section section--muted order-result-section" aria-live="polite">
      <div class="section-shell">
        <div class="order-result-heading">
          <div>
            <p class="eyebrow">Order Found</p>
            <h2>{{ order.order_number }}</h2>
          </div>
          <span class="status-badge" :class="`status-badge--${order.fulfillment_status}`">
            {{ formatStatus(order.fulfillment_status) }}
          </span>
        </div>
        <dl class="order-result-grid">
          <div>
            <dt>Product Name</dt>
            <dd>{{ order.product_name }}</dd>
          </div>
          <div>
            <dt>Quantity</dt>
            <dd>{{ order.quantity }}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{{ formatMoney(order.total_amount, order.currency) }}</dd>
          </div>
          <div>
            <dt>Payment Status</dt>
            <dd>{{ formatStatus(order.payment_status) }}</dd>
          </div>
          <div>
            <dt>Fulfillment Status</dt>
            <dd>{{ formatStatus(order.fulfillment_status) }}</dd>
          </div>
          <div>
            <dt>Created At</dt>
            <dd>{{ formatDate(order.created_at) }}</dd>
          </div>
          <div>
            <dt>Shipping Carrier</dt>
            <dd>{{ order.shipping_carrier || 'Not available yet' }}</dd>
          </div>
          <div>
            <dt>Tracking Number</dt>
            <dd>{{ order.tracking_number || 'Not available yet' }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </main>
</template>
