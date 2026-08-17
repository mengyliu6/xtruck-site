<script setup lang="ts">
import { computed, ref } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PayPalCheckout from '@/components/payment/PayPalCheckout.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'

const quantity = ref(1)
const paymentProcessing = ref(false)
const totalPrice = computed(() => formatPrice(product.priceUsd * quantity.value))
</script>

<template>
  <main class="product-purchase-page">
    <div class="section-shell product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span>OHW808</span>
    </div>

    <section class="section-shell product-purchase" aria-labelledby="product-purchase-title">
      <div class="product-purchase__media">
        <img
          src="/images/ohw808-device.jpg"
          alt="Xtruck OHW808 diagnostic tablet on a white background"
          loading="eager"
        />
      </div>

      <div class="product-purchase__summary">
        <p class="eyebrow">{{ product.brand }}</p>
        <h1 id="product-purchase-title">{{ product.name }}</h1>
        <p class="product-purchase__price">{{ formatPrice(product.priceUsd) }} <span>USD</span></p>

        <div class="quantity-control">
          <label for="product-quantity">Quantity</label>
          <select id="product-quantity" v-model.number="quantity" :disabled="paymentProcessing">
            <option v-for="value in 5" :key="value" :value="value">{{ value }}</option>
          </select>
        </div>

        <div class="order-total" aria-live="polite">
          <span>Item total</span>
          <strong>{{ totalPrice }} USD</strong>
        </div>
        <p class="shipping-note">
          The final order total is confirmed by the server and shown in PayPal before approval.
        </p>

        <PayPalCheckout :quantity="quantity" @processing-change="paymentProcessing = $event" />

        <div class="product-purchase__actions">
          <WhatsAppButton label="Contact Xtruck on WhatsApp" />
          <a class="button button--secondary" href="/">Back to Home</a>
        </div>
      </div>
    </section>

    <section class="section product-details-section" aria-labelledby="product-details-title">
      <div class="section-shell">
        <p class="eyebrow">OHW808</p>
        <h2 id="product-details-title">Product Details</h2>
        <div class="product-details-content">
          <!-- Product detail content will be supplied later. -->
        </div>
      </div>
    </section>
  </main>
</template>
