<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{
  quantity: number
}>()

const isOpen = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const orderNumber = ref('')
const whatsappUrl = ref('')
const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  address: '',
})

async function submitRequest() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('/api/bank-transfer/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, quantity: props.quantity }),
    })
    const result = (await response.json()) as {
      orderNumber?: string
      whatsappUrl?: string
      error?: string
    }

    if (!response.ok || !result.orderNumber) {
      throw new Error(result.error || 'The bank transfer request could not be submitted.')
    }

    orderNumber.value = result.orderNumber
    whatsappUrl.value = result.whatsappUrl || ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bank-transfer">
    <button
      class="button button--secondary bank-transfer__toggle"
      type="button"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      Pay by Hong Kong bank transfer
    </button>

    <div v-if="isOpen" class="bank-transfer__panel">
      <div v-if="orderNumber" class="checkout-success" role="status">
        <strong>Transfer request received</strong>
        <span>Your order number is {{ orderNumber }}.</span>
        <span>Contact our team to receive the verified bank details.</span>
        <a v-if="whatsappUrl" class="button button--primary" :href="whatsappUrl" target="_blank">
          Continue on WhatsApp
        </a>
      </div>

      <form v-else class="bank-transfer__form" @submit.prevent="submitRequest">
        <p>
          Submit your details first. For security, bank account information is provided by our team
          after the request is verified.
        </p>

        <label>
          Full name
          <input v-model.trim="form.name" name="name" autocomplete="name" required />
        </label>
        <label>
          Email
          <input
            v-model.trim="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
        </label>
        <label>
          Phone / WhatsApp
          <input v-model.trim="form.phone" name="phone" autocomplete="tel" required />
        </label>
        <label>
          Company (optional)
          <input v-model.trim="form.company" name="company" autocomplete="organization" />
        </label>
        <label>
          Country / region
          <input v-model.trim="form.country" name="country" autocomplete="country-name" required />
        </label>
        <label>
          Shipping address
          <textarea v-model.trim="form.address" name="address" rows="3" required></textarea>
        </label>

        <button class="button button--primary" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting…' : 'Request bank transfer details' }}
        </button>
        <p v-if="errorMessage" class="checkout-error" role="alert">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
