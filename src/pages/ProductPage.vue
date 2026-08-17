<script setup lang="ts">
import { computed, ref } from 'vue'

import BankTransferForm from '@/components/payment/BankTransferForm.vue'
import PayPalCheckout from '@/components/payment/PayPalCheckout.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { formatPrice, siteConfig } from '@/config/site'
import { product } from '@/data/product'

const quantity = ref(1)
const total = computed(() => product.priceUsd * quantity.value)

function decreaseQuantity() {
  quantity.value = Math.max(1, quantity.value - 1)
}

function increaseQuantity() {
  quantity.value = Math.min(5, quantity.value + 1)
}
</script>

<template>
  <main class="product-page">
    <div class="section-shell product-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <span>{{ product.model }}</span>
    </div>

    <section class="section-shell product-purchase">
      <div class="product-purchase__media">
        <PreviewImage
          src="/images/ohw808-device.jpg"
          alt="Xtruck OHW808 diagnostic tablet on a white background"
          loading="eager"
        />
      </div>

      <div class="product-purchase__copy">
        <p class="eyebrow">Xtruck Diagnostic Tool</p>
        <h1>{{ product.name }}</h1>
        <p class="product-purchase__summary">{{ product.summary }}</p>
        <div class="product-purchase__price">{{ formatPrice(total) }} USD</div>

        <div class="quantity-field">
          <span>Quantity</span>
          <div class="quantity-control">
            <button type="button" aria-label="Decrease quantity" @click="decreaseQuantity">
              −
            </button>
            <output :aria-label="`Quantity ${quantity}`">{{ quantity }}</output>
            <button type="button" aria-label="Increase quantity" @click="increaseQuantity">
              +
            </button>
          </div>
        </div>

        <section class="checkout-panel" aria-labelledby="checkout-heading">
          <div class="checkout-panel__heading">
            <span>Secure checkout</span>
            <h2 id="checkout-heading">Choose a payment method</h2>
          </div>

          <PayPalCheckout
            v-if="siteConfig.paymentsEnabled"
            :quantity="quantity"
            :client-id="siteConfig.paypalClientId"
          />
          <p v-else class="checkout-message">Online payment is currently unavailable.</p>

          <BankTransferForm v-if="siteConfig.bankTransferEnabled" :quantity="quantity" />
        </section>

        <div class="purchase-support">
          <strong>Confirm compatibility before ordering</strong>
          <p>Send your equipment brand, model, year, engine and required functions.</p>
          <WhatsAppButton label="Ask on WhatsApp" />
        </div>
      </div>
    </section>

    <!-- Product detail description intentionally left empty until approved content is supplied. -->
    <div id="product-description" class="product-description-placeholder" aria-hidden="true"></div>
  </main>
</template>
