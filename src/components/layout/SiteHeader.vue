<script setup lang="ts">
import { ref } from 'vue'

import { navigationItems, siteConfig } from '@/config/site'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'

const isOpen = ref(false)

function closeMenu() {
  isOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__bar section-shell">
      <a href="#top" class="brand-mark" aria-label="Xtruck home" @click="closeMenu">
        <span class="brand-mark__symbol">X</span>
        <span>{{ siteConfig.brandName }}</span>
      </a>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="site-navigation"
        @click="isOpen = !isOpen"
      >
        <span class="menu-toggle__line"></span>
        <span class="menu-toggle__line"></span>
        <span class="menu-toggle__line"></span>
        <span class="sr-only">Menu</span>
      </button>

      <nav id="site-navigation" class="site-nav" :class="{ 'site-nav--open': isOpen }">
        <a v-for="item in navigationItems" :key="item.href" :href="item.href" @click="closeMenu">
          {{ item.label }}
        </a>
      </nav>

      <WhatsAppButton
        class="site-header__cta"
        :label="`WhatsApp ${siteConfig.whatsappDisplayNumber}`"
      />
    </div>
  </header>
</template>
