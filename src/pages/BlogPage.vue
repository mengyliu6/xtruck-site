<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { product } from '@/data/product'

const articleImages = [
  '/images/workflow/cummins-functions.png',
  '/images/tools/remote-diagnosis.png',
  '/images/ui/software-upgrade.png',
]

const articleIcons = ['engine', 'remote', 'update'] as const
</script>

<template>
  <main class="blog-page">
    <section class="blog-hero">
      <div class="section-shell blog-hero__inner">
        <div>
          <p class="eyebrow">Xtruck Blog</p>
          <h1>OHW808 service guides and product news</h1>
          <p>
            Practical reference for diagnostic workflows, remote support, software updates and
            professional use of Xtruck OHW808.
          </p>
        </div>
        <PreviewImage
          src="/images/ui/ohw808-home.png"
          alt="Xtruck OHW808 diagnostic software home screen"
        />
      </div>
    </section>

    <section class="section blog-index">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Service Guides</p>
          <h2>Work confidently with OHW808</h2>
          <p>Focused guidance for common workshop and field-service tasks.</p>
        </div>
        <div class="blog-card-grid">
          <article
            v-for="(article, index) in product.articles"
            :key="article.title"
            class="blog-card"
          >
            <PreviewImage :src="articleImages[index]" :alt="article.title" />
            <div>
              <span>Guide {{ String(index + 1).padStart(2, '0') }}</span>
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
              <a :href="`#guide-${index + 1}`">Read guide</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell blog-guides">
        <article
          v-for="(article, index) in product.articles"
          :id="`guide-${index + 1}`"
          :key="article.title"
          class="blog-guide"
        >
          <div class="blog-guide__copy">
            <IconGlyph :name="articleIcons[index]" />
            <p class="eyebrow">OHW808 Guide {{ String(index + 1).padStart(2, '0') }}</p>
            <h2>{{ article.title }}</h2>
            <p>{{ article.description }}</p>
            <ol>
              <li v-for="point in article.points" :key="point">{{ point }}</li>
            </ol>
          </div>
          <PreviewImage :src="articleImages[index]" :alt="article.title" />
        </article>
      </div>
    </section>

    <section class="section blog-contact">
      <div class="section-shell blog-contact__inner">
        <div>
          <p class="eyebrow">Product Support</p>
          <h2>Need help with an OHW808 application?</h2>
          <p>Send your equipment details and diagnostic requirements to the Xtruck team.</p>
        </div>
        <WhatsAppButton label="Contact Xtruck" />
      </div>
    </section>
  </main>
</template>
