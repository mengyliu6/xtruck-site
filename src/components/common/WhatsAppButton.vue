<script setup lang="ts">
import { computed } from 'vue'

import { getWhatsAppUrl } from '@/config/site'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: 'primary' | 'secondary' | 'floating' | 'mobile'
  }>(),
  {
    label: 'Contact on WhatsApp',
    variant: 'primary',
  },
)

const href = computed(() =>
  getWhatsAppUrl(typeof window === 'undefined' ? '' : window.location.href),
)
</script>

<template>
  <a
    :href="href"
    class="whatsapp-button"
    :class="`whatsapp-button--${props.variant}`"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" class="whatsapp-button__icon" fill="currentColor">
      <path
        d="M12.04 3.5a8.46 8.46 0 0 0-7.18 12.93L3.8 20.5l4.18-1.1a8.46 8.46 0 1 0 4.06-15.9Zm0 1.55a6.91 6.91 0 0 1 5.9 10.52 6.91 6.91 0 0 1-8.63 2.48l-.3-.15-2.48.66.64-2.4-.18-.31a6.91 6.91 0 0 1 5.05-10.8Zm-3.2 3.68c-.15 0-.4.05-.61.3-.21.24-.8.78-.8 1.9 0 1.11.82 2.19.93 2.34.11.15 1.58 2.52 3.91 3.43 1.94.76 2.34.61 2.76.57.42-.04 1.36-.56 1.55-1.09.19-.54.19-1 .13-1.1-.06-.09-.21-.15-.45-.27-.23-.11-1.36-.67-1.58-.75-.21-.08-.36-.11-.52.12-.15.23-.6.75-.73.9-.13.15-.27.17-.5.06-.23-.12-.98-.36-1.87-1.15-.69-.62-1.16-1.38-1.3-1.61-.13-.23-.01-.36.1-.48.1-.1.23-.27.34-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.71-1.72-.19-.45-.38-.39-.52-.4h-.35Z"
      />
    </svg>
    <span>{{ props.label }}</span>
  </a>
</template>
