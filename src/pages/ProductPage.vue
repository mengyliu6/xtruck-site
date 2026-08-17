<script setup lang="ts">
import { computed, ref } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import PayPalCheckout from '@/components/payment/PayPalCheckout.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'

const quantity = ref(1)
const paymentProcessing = ref(false)
const totalPrice = computed(() => formatPrice(product.priceUsd * quantity.value))
const productImages = [
  {
    src: '/images/product/ohw808-complete-set.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet and VCI complete set on a white background',
    label: 'Complete set',
  },
  {
    src: '/images/product/ohw808-tablet-front.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet front view with the latest interface',
    label: 'Tablet',
  },
  {
    src: '/images/product/ohw808-vci.jpg',
    alt: 'Xtruck OHW808 vehicle communication interface on a white background',
    label: 'VCI',
  },
  {
    src: '/images/product/ohw808-full-kit.jpg',
    alt: 'Xtruck OHW808 complete diagnostic kit and accessories on a white background',
    label: 'Full kit',
  },
]
const activeImageIndex = ref(0)
const activeImage = computed(() => productImages[activeImageIndex.value]!)

function showPreviousImage() {
  activeImageIndex.value =
    (activeImageIndex.value - 1 + productImages.length) % productImages.length
}

function showNextImage() {
  activeImageIndex.value = (activeImageIndex.value + 1) % productImages.length
}

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
          <PreviewImage :src="activeImage.src" :alt="activeImage.alt" loading="eager" />
          <span class="product-gallery__position">
            {{ activeImageIndex + 1 }} / {{ productImages.length }}
          </span>
        </div>
        <div class="product-gallery__rail" aria-label="OHW808 product gallery">
          <button
            type="button"
            class="product-gallery__nav"
            aria-label="Previous image"
            title="Previous image"
            @click="showPreviousImage"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            v-for="(image, index) in productImages"
            :key="image.src"
            type="button"
            class="product-gallery__thumb"
            :class="{ 'product-gallery__thumb--active': activeImageIndex === index }"
            :aria-label="`View ${image.label}`"
            :aria-current="activeImageIndex === index ? 'true' : undefined"
            @click="activeImageIndex = index"
          >
            <img :src="image.src" alt="" />
            <span>{{ image.label }}</span>
          </button>
          <button
            type="button"
            class="product-gallery__nav"
            aria-label="Next image"
            title="Next image"
            @click="showNextImage"
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
