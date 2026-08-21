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
import BrandDetailPage from '@/pages/BrandDetailPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import OrderStatusPage from '@/pages/OrderStatusPage.vue'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const hostname = window.location.hostname.toLowerCase()
const isAdminHost =
  hostname === 'admin.xtruckohw808.com' ||
  (import.meta.env.DEV && new URLSearchParams(window.location.search).get('admin') === '1')
const isBlockedAdminPath =
  !isAdminHost && (currentPath === '/admin' || currentPath.startsWith('/admin/'))
if (isBlockedAdminPath) window.location.replace('/')
const isAgentPage = currentPath === '/agent'
const isBlogPage = currentPath === '/blog'
const isVolvoBrandPage = currentPath === '/brand/volvo'
const isProductPage = currentPath === '/product/ohw808'
const isOrderStatusPage = currentPath === '/order-status'

function setMetaContent(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

onMounted(() => {
  if (isAdminHost) {
    document.title = 'Xtruck Administration'
    return
  }

  if (isBlockedAdminPath) {
    document.title = 'Page Not Found | Xtruck'
    return
  }

  if (isOrderStatusPage) {
    document.title = 'Order Status | Xtruck OHW808'
    const description = 'Check your Xtruck OHW808 payment and fulfillment status securely.'
    const orderStatusUrl = new URL('/order-status', siteConfig.canonicalUrl).href
    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', document.title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:url"]', orderStatusUrl)
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', orderStatusUrl)
    return
  }

  if (isProductPage) {
    document.title = 'Buy Xtruck OHW808 | Secure PayPal Checkout'
    const description =
      'Order the Xtruck OHW808 professional off-highway diagnostic tool using secure PayPal checkout.'
    const productUrl = new URL('/product/ohw808', siteConfig.canonicalUrl).href

    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', document.title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:type"]', 'product')
    setMetaContent('meta[property="og:url"]', productUrl)
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', productUrl)
    return
  }

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

  if (isVolvoBrandPage) {
    document.title = 'Volvo Engine Diagnostic Capabilities | Xtruck OHW808'
    const description =
      'Review Xtruck OHW808 Volvo J1708 and Volvo 500K engine-related diagnostic capabilities, core functions and model-dependent service functions.'
    const brandUrl = new URL('/brand/volvo', siteConfig.canonicalUrl).href

    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', document.title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:type"]', 'website')
    setMetaContent('meta[property="og:url"]', brandUrl)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', brandUrl)
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
  <AdminPage v-if="isAdminHost" />
  <template v-else>
    <SiteHeader />
    <template v-if="isProductPage">
      <ProductPage />
    </template>
    <template v-else-if="isOrderStatusPage">
      <OrderStatusPage />
    </template>
    <template v-else-if="isAgentPage">
      <AgentPage />
    </template>
    <template v-else-if="isBlogPage">
      <BlogPage />
    </template>
    <template v-else-if="isVolvoBrandPage">
      <BrandDetailPage />
    </template>
    <template v-else>
      <ProductHero />
      <ProductSections />
    </template>
    <SiteFooter />
    <template v-if="!isProductPage">
      <WhatsAppButton class="floating-whatsapp" label="WhatsApp" variant="floating" />
      <WhatsAppButton class="mobile-contact-bar" label="WhatsApp" variant="mobile" />
    </template>
  </template>
</template>
