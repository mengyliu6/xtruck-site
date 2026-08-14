<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  src: string
  alt: string
  loading?: 'eager' | 'lazy'
}>()

const isOpen = ref(false)
const attrs = useAttrs()

function openPreview() {
  isOpen.value = true
  document.body.classList.add('preview-open')
}

function closePreview() {
  isOpen.value = false
  document.body.classList.remove('preview-open')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closePreview()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('preview-open')
})
</script>

<template>
  <button type="button" class="preview-image" aria-label="Open image preview" @click="openPreview">
    <img :src="src" :alt="alt" :loading="loading || 'lazy'" />
    <span class="preview-image__hint" aria-hidden="true">View</span>
  </button>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="image-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="`${alt} preview`"
      @click.self="closePreview"
    >
      <button
        v-bind="attrs"
        type="button"
        class="image-preview__close"
        aria-label="Close image preview"
        @click="closePreview"
      >
        <span aria-hidden="true">X</span>
      </button>
      <img :src="src" :alt="alt" />
    </div>
  </Teleport>
</template>
