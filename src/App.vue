<script setup lang="ts">
import { onMounted } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import ProductHero from '@/components/product/ProductHero.vue'
import ProductSections from '@/components/product/ProductSections.vue'
import { siteConfig } from '@/config/site'
import { product } from '@/data/product'
import AgentPage from '@/pages/AgentPage.vue'
import BlogPage from '@/pages/BlogPage.vue'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isAgentPage = currentPath === '/agent'
const isBlogPage = currentPath === '/blog'

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

onMounted(() => {
  if (isAgentPage) {
    document.title = 'Global OHW808 Agent & Distributor Program | Xtruck'
    const description =
      'Join the Xtruck OHW808 global agent and distributor program for professional off-highway and agricultural equipment diagnostics.'
    const agentUrl = new URL('/agent', siteConfig.canonicalUrl).href

    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', document.title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:type"]', 'website')
    setMetaContent('meta[property="og:url"]', agentUrl)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', agentUrl)
    return
  }

  if (isBlogPage) {
    document.title = 'OHW808 Service Guides & Product News | Xtruck Blog'
    const description =
      'Xtruck OHW808 service guides covering diagnostic workflows, remote support, software updates and professional equipment maintenance.'
    const blogUrl = new URL('/blog', siteConfig.canonicalUrl).href

    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', document.title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:type"]', 'website')
    setMetaContent('meta[property="og:url"]', blogUrl)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', blogUrl)
    return
  }

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
  <template v-if="isAgentPage">
    <AgentPage />
  </template>
  <template v-else-if="isBlogPage">
    <BlogPage />
  </template>
  <template v-else>
    <ProductHero />
    <ProductSections />
  </template>
  <SiteFooter />
  <WhatsAppButton class="floating-whatsapp" label="WhatsApp" variant="floating" />
  <WhatsAppButton class="mobile-contact-bar" label="WhatsApp" variant="mobile" />
</template>
