<script setup lang="ts">
import type { IconName } from '@/types/product'

defineProps<{
  name: IconName
}>()
</script>

<template>
  <svg
    v-if="name === 'machine'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 16h11l3-5h2" />
    <path d="M6 16V7h5l4 4" />
    <path d="M2 19h20" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
  </svg>
  <svg
    v-else-if="name === 'tractor'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M5 13V8h5l3 5h4l2 3" />
    <path d="M10 8V5h3" />
    <circle cx="7" cy="18" r="3" />
    <circle cx="18" cy="18" r="2" />
  </svg>
  <svg
    v-else-if="name === 'engine'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 10h3l2-3h4l2 3h3v8H7l-3-3z" />
    <path d="M18 12h3v4h-3" />
    <path d="M10 7V4h4" />
  </svg>
  <svg
    v-else-if="name === 'obd'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M5 8h14l-1 9H6z" />
    <path d="M8 8V5h8v3" />
    <path d="M8 12h8" />
    <path d="M9 16h.01M12 16h.01M15 16h.01" />
  </svg>
  <svg
    v-else-if="name === 'toolbox'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 9h16v10H4z" />
    <path d="M9 9V6h6v3" />
    <path d="M4 13h16" />
    <path d="M12 12v3" />
  </svg>
  <svg
    v-else-if="name === 'remote'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="4" y="5" width="16" height="10" rx="2" />
    <path d="M8 19h8" />
    <path d="M12 15v4" />
    <path d="M9 10h6" />
  </svg>
  <svg
    v-else-if="name === 'update'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M20 12a8 8 0 1 1-2.3-5.7" />
    <path d="M20 5v6h-6" />
  </svg>
  <svg
    v-else-if="name === 'database'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
    <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
  </svg>
  <svg
    v-else-if="name === 'shield'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 3 20 6v6c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V6z" />
    <path d="m8.5 12 2.2 2.2 4.8-5" />
  </svg>
  <svg
    v-else-if="name === 'screen'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="4" y="5" width="16" height="12" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
  <svg
    v-else-if="name === 'message'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M4 5h16v11H8l-4 4z" />
    <path d="M8 9h8M8 13h5" />
  </svg>
  <svg
    v-else-if="name === 'download'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 4v10" />
    <path d="m8 10 4 4 4-4" />
    <path d="M5 20h14" />
  </svg>
  <svg
    v-else-if="name === 'expand'"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M8 3H3v5" />
    <path d="m3 3 6 6" />
    <path d="M16 3h5v5" />
    <path d="m21 3-6 6" />
    <path d="M8 21H3v-5" />
    <path d="m3 21 6-6" />
    <path d="M16 21h5v-5" />
    <path d="m21 21-6-6" />
  </svg>
  <svg
    v-else
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="icon-glyph"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6" />
  </svg>
</template>
