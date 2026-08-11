<script setup lang="ts">
import { computed, ref } from 'vue'

import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PurchasePanel from '@/components/product/PurchasePanel.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'
import type { ProductMedia } from '@/types/product'

const activeMedia = ref<ProductMedia>(product.media[0])
const isLightboxOpen = ref(false)

const imageMedia = computed(() => product.media.filter((item) => item.type === 'image'))

function selectMedia(item: ProductMedia) {
  activeMedia.value = item
}
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">Heavy-Duty Diagnostic Tool</p>
      <h1>{{ product.name }}</h1>
      <p class="hero__summary">{{ product.summary }}</p>
      <ul class="hero__points">
        <li v-for="point in product.coreSellingPoints" :key="point">{{ point }}</li>
      </ul>
      <div class="hero__price" aria-label="Product price">{{ formatPrice(product.priceUsd) }}</div>
      <div class="hero__actions">
        <WhatsAppButton />
        <a href="#overview" class="button button--secondary">View Product Details</a>
      </div>
    </div>

    <div class="hero__media" aria-label="Product media gallery">
      <button
        v-if="activeMedia.type === 'image'"
        type="button"
        class="hero__image-button"
        @click="isLightboxOpen = true"
      >
        <img :src="activeMedia.src" :alt="activeMedia.alt" fetchpriority="high" />
        <span>Open large image</span>
      </button>
      <video
        v-else
        class="hero__video-preview"
        :src="activeMedia.src"
        :poster="activeMedia.poster"
        muted
        playsinline
        controls
      >
        Video preview is not available in this browser.
      </video>

      <div class="media-thumbs" aria-label="Choose product media">
        <button
          v-for="item in product.media"
          :key="item.src"
          type="button"
          :class="{ 'media-thumbs__item--active': activeMedia.src === item.src }"
          class="media-thumbs__item"
          @click="selectMedia(item)"
        >
          <img :src="item.poster || item.src" :alt="item.label" loading="lazy" />
          <span>{{ item.type === 'video' ? 'Video' : 'Image' }}</span>
        </button>
      </div>
    </div>

    <PurchasePanel class="hero__purchase" />

    <div v-if="isLightboxOpen" class="lightbox" role="dialog" aria-modal="true">
      <button class="lightbox__close" type="button" @click="isLightboxOpen = false">Close</button>
      <button
        v-for="item in imageMedia"
        :key="item.src"
        type="button"
        class="lightbox__image-option"
        @click="activeMedia = item"
      >
        {{ item.label }}
      </button>
      <img :src="activeMedia.src" :alt="activeMedia.alt" />
    </div>
  </section>
</template>
