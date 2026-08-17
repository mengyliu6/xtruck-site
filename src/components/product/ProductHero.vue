<script setup lang="ts">
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">Professional Off-Highway Diagnostics</p>
      <h1>{{ product.name }}</h1>
      <p class="hero__summary">{{ product.summary }}</p>
      <ul class="hero__points">
        <li v-for="point in product.coreSellingPoints" :key="point">{{ point }}</li>
      </ul>
      <div class="hero__price" aria-label="Product price">{{ formatPrice(product.priceUsd) }}</div>
      <div class="hero__actions">
        <WhatsAppButton />
        <a href="/product/ohw808" class="button button--secondary">View Product Details</a>
      </div>
    </div>

    <div class="hero__media" aria-label="Xtruck OHW808 product and software">
      <PreviewImage
        class="hero__product-image"
        src="/images/ohw808-device.jpg"
        alt="Xtruck OHW808 diagnostic tablet"
        loading="eager"
      />
      <figure class="hero__interface-image">
        <PreviewImage src="/images/ui/ohw808-home.png" alt="Xtruck OHW808 main software menu" />
        <figcaption>Construction, agriculture, engine and HD OBD diagnostics</figcaption>
      </figure>
    </div>
  </section>
</template>
