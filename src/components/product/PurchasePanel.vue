<script setup lang="ts">
import { formatPrice, siteConfig } from '@/config/site'
import { product } from '@/data/product'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
</script>

<template>
  <aside class="purchase-panel" aria-label="Product purchase information">
    <p class="eyebrow">Product Inquiry</p>
    <div class="purchase-panel__price">{{ formatPrice(product.priceUsd) }}</div>
    <p class="purchase-panel__note">
      Online checkout is not enabled yet. Please contact Xtruck on WhatsApp to confirm
      compatibility, order details, and support options.
    </p>
    <WhatsAppButton />
    <p v-if="!siteConfig.paymentsEnabled" class="purchase-panel__future">
      Payment integration placeholder prepared for future checkout.
    </p>
  </aside>
</template>
