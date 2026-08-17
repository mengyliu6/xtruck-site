<script setup lang="ts">
import { computed, ref } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PayPalCheckout from '@/components/payment/PayPalCheckout.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'

const quantity = ref(1)
const paymentProcessing = ref(false)
const totalPrice = computed(() => formatPrice(product.priceUsd * quantity.value))

function changeQuantity(amount: number) {
  const currentQuantity = Math.round(Number(quantity.value) || 1)
  quantity.value = Math.min(5, Math.max(1, currentQuantity + amount))
}

function normalizeQuantity() {
  const nextQuantity = Math.round(Number(quantity.value) || 1)
  quantity.value = Math.min(5, Math.max(1, nextQuantity))
}
</script>

<template>
  <main class="product-purchase-page">
    <div class="section-shell product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span>OHW808</span>
    </div>

    <section class="section-shell product-purchase" aria-labelledby="product-purchase-title">
      <div class="product-gallery">
        <div class="product-purchase__media">
          <img
            src="/images/ohw808-device.jpg"
            alt="Xtruck OHW808 diagnostic tablet on a white background"
            loading="eager"
          />
        </div>
        <div class="product-gallery__rail" aria-label="OHW808 product gallery">
          <button
            type="button"
            class="product-gallery__nav"
            disabled
            aria-label="Previous image"
            title="Previous image"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            class="product-gallery__thumb product-gallery__thumb--active"
            aria-label="View OHW808 front image"
            aria-current="true"
          >
            <img src="/images/ohw808-device.jpg" alt="" />
            <span>Front</span>
          </button>
          <button
            v-for="imageNumber in [2, 3, 4]"
            :key="imageNumber"
            type="button"
            class="product-gallery__thumb product-gallery__thumb--placeholder"
            disabled
            :aria-label="`Product image ${imageNumber} coming soon`"
          >
            <strong>{{ String(imageNumber).padStart(2, '0') }}</strong>
            <span>Coming soon</span>
          </button>
          <button
            type="button"
            class="product-gallery__nav"
            disabled
            aria-label="Next image"
            title="Next image"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>

      <div class="product-purchase__summary">
        <p class="eyebrow">{{ product.brand }}</p>
        <h1 id="product-purchase-title">{{ product.name }}</h1>
        <p class="product-purchase__price">{{ formatPrice(product.priceUsd) }} <span>USD</span></p>

        <div class="quantity-control">
          <div>
            <label for="product-quantity">Quantity</label>
            <span>Maximum 5 per order</span>
          </div>
          <div class="quantity-stepper">
            <button
              type="button"
              :disabled="paymentProcessing || quantity <= 1"
              aria-label="Decrease quantity"
              title="Decrease quantity"
              @click="changeQuantity(-1)"
            >
              <span aria-hidden="true">-</span>
            </button>
            <input
              id="product-quantity"
              v-model.number="quantity"
              type="number"
              inputmode="numeric"
              min="1"
              max="5"
              step="1"
              :disabled="paymentProcessing"
              aria-describedby="quantity-limit"
              @change="normalizeQuantity"
              @blur="normalizeQuantity"
            />
            <button
              type="button"
              :disabled="paymentProcessing || quantity >= 5"
              aria-label="Increase quantity"
              title="Increase quantity"
              @click="changeQuantity(1)"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <span id="quantity-limit" class="visually-hidden">Choose between 1 and 5 units.</span>
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
