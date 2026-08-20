<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PayPalCheckout from '@/components/payment/PayPalCheckout.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'

const quantity = ref(1)
const paymentProcessing = ref(false)
const totalPrice = computed(() => formatPrice(product.priceUsd * quantity.value))
const productImages = [
  {
    src: '/images/product/ohw808-tablet-front-render.jpg',
    alt: 'Xtruck OHW808 rugged diagnostic tablet front view on a white background',
    label: 'Front view',
  },
  {
    src: '/images/product/ohw808-tablet-angle-render.jpg',
    alt: 'Xtruck OHW808 rugged diagnostic tablet angled view on a white background',
    label: 'Angle view',
  },
  {
    src: '/images/product/ohw808-complete-set.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet and VCI complete set on a white background',
    label: 'Complete set',
  },
  {
    src: '/images/product/ohw808-controls.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet controls and software interface',
    label: 'Controls',
  },
  {
    src: '/images/product/ohw808-tablet-front.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet front view with the latest interface',
    label: 'Tablet',
  },
  {
    src: '/images/product/ohw808-ports.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet USB and USB-C connection ports',
    label: 'Ports',
  },
  {
    src: '/images/product/ohw808-vci.jpg',
    alt: 'Xtruck OHW808 vehicle communication interface on a white background',
    label: 'VCI',
  },
  {
    src: '/images/product/ohw808-rear-stand.jpg',
    alt: 'Xtruck OHW808 diagnostic tablet rear stand and product label',
    label: 'Rear stand',
  },
  {
    src: '/images/product/ohw808-full-kit.jpg',
    alt: 'Xtruck OHW808 complete diagnostic kit and accessories on a white background',
    label: 'Full kit',
  },
]
const activeImageIndex = ref(0)
const activeImage = computed(() => productImages[activeImageIndex.value]!)
const thumbnailRail = ref<HTMLDivElement | null>(null)
const isZooming = ref(false)

function showImage(index: number) {
  activeImageIndex.value = index
  isZooming.value = false

  void nextTick(() => {
    thumbnailRail.value
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  })
}

function showPreviousImage() {
  showImage((activeImageIndex.value - 1 + productImages.length) % productImages.length)
}

function showNextImage() {
  showImage((activeImageIndex.value + 1) % productImages.length)
}

function updateZoomPosition(event: MouseEvent) {
  const media = event.currentTarget as HTMLElement
  const bounds = media.getBoundingClientRect()
  const x = ((event.clientX - bounds.left) / bounds.width) * 100
  const y = ((event.clientY - bounds.top) / bounds.height) * 100

  media.style.setProperty('--zoom-x', `${Math.min(100, Math.max(0, x))}%`)
  media.style.setProperty('--zoom-y', `${Math.min(100, Math.max(0, y))}%`)
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
        <div
          class="product-purchase__media"
          :class="{ 'product-purchase__media--zooming': isZooming }"
          @mouseenter="isZooming = true"
          @mousemove="updateZoomPosition"
          @mouseleave="isZooming = false"
        >
          <img :src="activeImage.src" :alt="activeImage.alt" loading="eager" />
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
          <div ref="thumbnailRail" class="product-gallery__thumbs">
            <button
              v-for="(image, index) in productImages"
              :key="image.src"
              type="button"
              class="product-gallery__thumb"
              :class="{ 'product-gallery__thumb--active': activeImageIndex === index }"
              :aria-label="`View ${image.label}`"
              :aria-current="activeImageIndex === index ? 'true' : undefined"
              @click="showImage(index)"
            >
              <img :src="image.src" alt="" />
              <span>{{ image.label }}</span>
            </button>
          </div>
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
            <span>Minimum order: 1 unit &middot; Maximum 5 per online order</span>
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
      <div class="section-shell product-details-heading">
        <p class="eyebrow">OHW808</p>
        <h2 id="product-details-title">Product Details</h2>
      </div>
      <div class="product-details-content">
        <figure class="product-detail-visual product-detail-visual--full">
          <img
            src="/images/product/details/coverage-100-brands.png"
            alt="OHW808 coverage for more than 100 construction and agricultural machinery brands"
            loading="lazy"
          />
        </figure>
        <figure class="product-detail-visual product-detail-visual--feature">
          <img
            src="/images/product/details/oe-level-system-diagnosis.png"
            alt="OHW808 OE-level system diagnostic functions"
            loading="lazy"
          />
        </figure>
        <figure class="product-detail-visual product-detail-visual--full">
          <img
            src="/images/product/details/multi-dimensional-live-data.png"
            alt="OHW808 multi-dimensional live data comparison and graphing functions"
            loading="lazy"
          />
        </figure>
        <figure class="product-detail-visual product-detail-visual--contained">
          <img
            src="/images/product/details/connectivity-and-hdmi-features-triptych.png"
            alt="OHW808 Bluetooth, USB and HDMI screen mirroring features"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  </main>
</template>
