<script setup lang="ts">
import { ref } from 'vue'

import { navigationItems, siteConfig } from '@/config/site'

const isOpen = ref(false)
const resourcesOpen = ref(false)

function closeMenu() {
  isOpen.value = false
  resourcesOpen.value = false
}

function isCurrentPage(href?: string) {
  if (!href || href.includes('#')) return false
  return window.location.pathname === href
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__bar section-shell">
      <a href="/" class="brand-mark" aria-label="Xtruck home" @click="closeMenu">
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
        <div v-for="item in navigationItems" :key="item.label" class="site-nav__item">
          <button
            v-if="item.children"
            class="site-nav__link site-nav__resource-toggle"
            type="button"
            :aria-expanded="resourcesOpen"
            aria-controls="resource-navigation"
            @click="resourcesOpen = !resourcesOpen"
          >
            {{ item.label }}
            <span class="site-nav__caret" aria-hidden="true"></span>
          </button>
          <a
            v-else
            class="site-nav__link"
            :class="{
              'site-nav__link--primary': item.kind === 'primary',
              'site-nav__link--utility': item.kind === 'utility',
              'site-nav__link--active': isCurrentPage(item.href),
            }"
            :href="item.href"
            :aria-current="isCurrentPage(item.href) ? 'page' : undefined"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>

          <div
            v-if="item.children"
            v-show="resourcesOpen"
            id="resource-navigation"
            class="site-nav__submenu"
          >
            <a
              v-for="child in item.children"
              :key="child.href"
              :href="child.href"
              @click="closeMenu"
            >
              {{ child.label }}
            </a>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
