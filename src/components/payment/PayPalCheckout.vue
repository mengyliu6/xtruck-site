<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  quantity: number
}>()

const emit = defineEmits<{
  processingChange: [value: boolean]
}>()

type CheckoutStatus =
  | 'setup-required'
  | 'loading'
  | 'ready'
  | 'creating'
  | 'capturing'
  | 'success'
  | 'pending'
  | 'cancelled'
  | 'failed'

interface ApiResponse {
  available?: boolean
  code?: string
  error?: string
  orderNumber?: string
  paypalOrderId?: string
  paymentStatus?: string
}

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim() || ''
const hasClientId =
  paypalClientId.length > 10 && !paypalClientId.toLowerCase().startsWith('replace_with_')
const buttonContainer = ref<HTMLElement | null>(null)
const checkoutAvailable = ref(false)
const status = ref<CheckoutStatus>(hasClientId ? 'loading' : 'setup-required')
const message = ref(
  hasClientId
    ? 'Confirming secure PayPal checkout availability...'
    : 'PayPal setup required. Checkout is temporarily unavailable.',
)
const orderNumber = ref('')
const capturedOrderIds = new Set<string>()
let checkoutRequestId = createRequestId()
let buttons: PayPalButtonsComponent | null = null
let paypalSdkPromise: Promise<void> | null = null

const isBusy = computed(() => status.value === 'creating' || status.value === 'capturing')

watch(
  () => props.quantity,
  () => {
    if (!isBusy.value) {
      checkoutRequestId = createRequestId()
      orderNumber.value = ''
      if (checkoutAvailable.value) {
        status.value = 'ready'
        message.value = 'Choose PayPal to continue to secure checkout.'
      }
    }
  },
)

watch(isBusy, (value) => emit('processingChange', value), { immediate: true })

function createRequestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `checkout-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function postJson(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = (await response.json().catch(() => ({}))) as ApiResponse

  if (!response.ok) {
    throw new Error(body.error || 'The payment request could not be completed.')
  }

  return body
}

async function confirmCheckoutAvailability() {
  const response = await fetch('/api/paypal/status', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  const body = (await response.json().catch(() => ({}))) as ApiResponse

  if (!response.ok || !body.available) {
    const error = new Error(body.error || 'PayPal checkout availability could not be confirmed.')
    Object.assign(error, { code: body.code })
    throw error
  }
}

function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve()
  if (paypalSdkPromise) return paypalSdkPromise

  paypalSdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    const query = new URLSearchParams({
      'client-id': paypalClientId,
      components: 'buttons',
      currency: 'USD',
      intent: 'capture',
    })
    script.src = `https://www.paypal.com/sdk/js?${query.toString()}`
    script.async = true
    script.dataset.sdkIntegrationSource = 'xtruck-ohw808'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('PayPal checkout could not be loaded.')),
      {
        once: true,
      },
    )
    document.head.appendChild(script)
  })

  return paypalSdkPromise
}

async function renderButtons() {
  if (!checkoutAvailable.value || !buttonContainer.value) return

  try {
    await loadPayPalSdk()
    if (!window.paypal || !buttonContainer.value) {
      throw new Error('PayPal checkout is unavailable.')
    }

    buttons = window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      style: {
        color: 'gold',
        disableMaxWidth: true,
        height: 48,
        label: 'buynow',
        layout: 'vertical',
        shape: 'rect',
        tagline: false,
      },
      async onClick(_data, actions) {
        if (isBusy.value) {
          await actions.reject()
          return
        }
        await actions.resolve()
      },
      async createOrder() {
        status.value = 'creating'
        message.value = 'Creating your secure PayPal order...'

        try {
          const result = await postJson('/api/paypal/create-order', {
            quantity: props.quantity,
            requestId: checkoutRequestId,
          })
          if (!result.paypalOrderId) throw new Error('PayPal did not return an order ID.')
          orderNumber.value = result.orderNumber || ''
          return result.paypalOrderId
        } catch (error) {
          status.value = 'failed'
          message.value = error instanceof Error ? error.message : 'Unable to create the order.'
          throw error
        }
      },
      async onApprove(data) {
        if (capturedOrderIds.has(data.orderID)) return

        status.value = 'capturing'
        message.value = 'Payment approved. Confirming the capture...'

        try {
          const result = await postJson('/api/paypal/capture-order', {
            orderId: data.orderID,
          })
          capturedOrderIds.add(data.orderID)
          orderNumber.value = result.orderNumber || orderNumber.value

          if (result.paymentStatus === 'paid') {
            status.value = 'success'
            message.value = 'Payment completed successfully. Your order has been recorded.'
            checkoutRequestId = createRequestId()
          } else {
            status.value = 'pending'
            message.value =
              result.paymentStatus === 'review'
                ? 'Payment received and placed under manual review. Please contact Xtruck with your order number.'
                : 'Payment is still processing. Please keep your order number for reference.'
          }
        } catch (error) {
          status.value = 'failed'
          message.value = error instanceof Error ? error.message : 'Unable to capture the payment.'
        }
      },
      onCancel() {
        status.value = 'cancelled'
        message.value = 'PayPal checkout was cancelled. No payment was recorded.'
      },
      onError(error) {
        status.value = 'failed'
        message.value =
          error instanceof Error
            ? error.message
            : 'PayPal checkout encountered an error. Please try again.'
      },
    })

    await buttons.render(buttonContainer.value)
    status.value = 'ready'
    message.value = 'Choose PayPal to continue to secure checkout.'
  } catch (error) {
    status.value = 'failed'
    message.value = error instanceof Error ? error.message : 'PayPal checkout could not be loaded.'
  }
}

async function initializeCheckout() {
  if (!hasClientId) return

  try {
    await confirmCheckoutAvailability()
    checkoutAvailable.value = true
    await nextTick()
    await renderButtons()
  } catch (error) {
    const isSetupRequired =
      error instanceof Error && 'code' in error && error.code === 'PAYMENT_SETUP_REQUIRED'
    status.value = isSetupRequired ? 'setup-required' : 'failed'
    message.value =
      error instanceof Error
        ? error.message
        : 'PayPal checkout availability could not be confirmed.'
  }
}

onMounted(initializeCheckout)

onBeforeUnmount(() => {
  emit('processingChange', false)
  void buttons?.close?.()
})
</script>

<template>
  <section class="paypal-checkout" aria-labelledby="paypal-checkout-title">
    <div class="paypal-checkout__heading">
      <span>Secure Payment</span>
      <h2 id="paypal-checkout-title">Pay with PayPal</h2>
    </div>

    <div v-if="checkoutAvailable" ref="buttonContainer" class="paypal-button-container"></div>
    <div v-else-if="status === 'setup-required'" class="paypal-setup-notice" role="status">
      <strong>PayPal setup required</strong>
      <p>Checkout is temporarily unavailable while the merchant account is being configured.</p>
    </div>

    <div
      v-if="status !== 'setup-required'"
      class="payment-status"
      :class="`payment-status--${status}`"
      :role="status === 'failed' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <strong v-if="status === 'success'">Payment successful</strong>
      <strong v-else-if="status === 'pending'">Payment processing</strong>
      <strong v-else-if="status === 'failed'">Payment unavailable</strong>
      <strong v-else-if="status === 'cancelled'">Payment cancelled</strong>
      <p>{{ message }}</p>
      <p v-if="orderNumber">Order reference: {{ orderNumber }}</p>
    </div>

    <p class="paypal-checkout__security">
      Payment approval is completed on PayPal. Xtruck does not receive or store your card details.
    </p>
  </section>
</template>
