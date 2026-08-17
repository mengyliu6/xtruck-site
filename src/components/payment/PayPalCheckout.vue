<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface PayPalApprovalData {
  orderID: string
}

interface PayPalButtonsInstance {
  render: (container: HTMLElement) => Promise<void>
  close?: () => void
}

interface PayPalNamespace {
  Buttons: (options: {
    style: Record<string, string | boolean | number>
    createOrder: () => Promise<string>
    onApprove: (data: PayPalApprovalData) => Promise<void>
    onCancel: () => void
    onError: (error: unknown) => void
  }) => PayPalButtonsInstance
}

declare global {
  interface Window {
    paypal?: PayPalNamespace
  }
}

const props = defineProps<{
  quantity: number
  clientId: string
}>()

const buttonContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successOrderNumber = ref('')
let buttons: PayPalButtonsInstance | null = null

let paypalScriptPromise: Promise<void> | null = null

function loadPayPalScript(clientId: string): Promise<void> {
  if (window.paypal) return Promise.resolve()
  if (paypalScriptPromise) return paypalScriptPromise

  paypalScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-xtruck-paypal]')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('PayPal could not load.')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.dataset.xtruckPaypal = 'true'
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons`
    script.async = true
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('PayPal could not load.')), {
      once: true,
    })
    document.head.appendChild(script)
  })

  return paypalScriptPromise
}

async function requestJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error || 'Payment request failed. Please try again.')
  }

  return data
}

async function renderButtons() {
  if (!props.clientId) return

  try {
    await loadPayPalScript(props.clientId)
    await nextTick()

    if (!window.paypal || !buttonContainer.value) {
      throw new Error('PayPal checkout is unavailable.')
    }

    buttons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 46,
        tagline: false,
      },
      createOrder: async () => {
        isLoading.value = true
        errorMessage.value = ''
        const result = await requestJson<{ id: string }>('/api/paypal/create-order', {
          quantity: props.quantity,
        })
        return result.id
      },
      onApprove: async ({ orderID }) => {
        try {
          const result = await requestJson<{ orderNumber: string; status: string }>(
            '/api/paypal/capture-order',
            { orderID },
          )
          successOrderNumber.value = result.orderNumber
        } catch (error) {
          errorMessage.value =
            error instanceof Error ? error.message : 'Payment confirmation failed.'
        } finally {
          isLoading.value = false
        }
      },
      onCancel: () => {
        isLoading.value = false
        errorMessage.value = 'Payment was cancelled. You have not been charged.'
      },
      onError: (error) => {
        isLoading.value = false
        errorMessage.value =
          error instanceof Error ? error.message : 'PayPal checkout could not be completed.'
      },
    })

    await buttons.render(buttonContainer.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'PayPal could not load.'
  }
}

onMounted(renderButtons)

onBeforeUnmount(() => {
  buttons?.close?.()
})
</script>

<template>
  <div class="paypal-checkout">
    <div v-if="successOrderNumber" class="checkout-success" role="status">
      <strong>Payment completed</strong>
      <span>Order {{ successOrderNumber }} has been received.</span>
      <span>Our team will contact you to confirm compatibility and delivery.</span>
    </div>

    <template v-else-if="clientId">
      <p v-if="isLoading" class="checkout-message" role="status">Opening secure checkout…</p>
      <div ref="buttonContainer" class="paypal-button-container"></div>
    </template>

    <div v-else class="checkout-unavailable">
      <strong>PayPal setup required</strong>
      <span>Online checkout will appear after the merchant account is connected.</span>
    </div>

    <p v-if="errorMessage" class="checkout-error" role="alert">{{ errorMessage }}</p>
  </div>
</template>
