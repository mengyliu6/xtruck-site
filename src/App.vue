<script setup lang="ts">
import { onMounted } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import ProductHero from '@/components/product/ProductHero.vue'
import ProductSections from '@/components/product/ProductSections.vue'
import { siteConfig } from '@/config/site'
import { product } from '@/data/product'

onMounted(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    model: product.model,
    image: product.media.filter((item) => item.type === 'image').map((item) => item.src),
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      priceCurrency: siteConfig.currency.code,
      price: product.priceUsd,
      url: window.location.href,
    },
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
})
</script>

<template>
  <SiteHeader />
  <ProductHero />
  <ProductSections />
  <SiteFooter />
  <WhatsAppButton class="floating-whatsapp" label="WhatsApp" variant="floating" />
  <WhatsAppButton class="mobile-contact-bar" label="Contact on WhatsApp" variant="mobile" />
</template>
