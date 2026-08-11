<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { siteConfig } from '@/config/site'
import { product } from '@/data/product'
</script>

<template>
  <main>
    <section class="section section--tight">
      <div class="section-shell">
        <div class="quick-grid" aria-label="Quick function overview">
          <article v-for="item in product.quickFunctions" :key="item" class="quick-card">
            <span class="quick-card__dot"></span>
            <span>{{ item }}</span>
          </article>
        </div>
      </div>
    </section>

    <section id="downloads" class="section section--downloads">
      <div class="section-shell">
        <div class="download-heading">
          <p class="eyebrow">Related Download Files</p>
          <h2>Downloads & Resources</h2>
          <p>
            Official files will be linked here when available. Missing resources are marked Coming
            Soon instead of sending customers to fake files.
          </p>
        </div>
        <ul class="download-list" aria-label="Related download files">
          <li v-for="item in product.downloads" :key="item.name" class="download-row">
            <IconGlyph name="document" />
            <a
              v-if="item.status === 'available' && item.href"
              :href="item.href"
              class="download-row__link"
              download
            >
              {{ item.name }}
            </a>
            <span v-else class="download-row__name">{{ item.name }}</span>
            <span class="download-row__meta">{{ item.size || 'Coming Soon' }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section id="overview" class="section">
      <div class="section-shell overview-layout">
        <div class="overview-media">
          <img
            src="/images/ohw808-device.jpg"
            alt="Xtruck OHW808 diagnostic device"
            loading="lazy"
          />
          <img src="/images/ohw808-ui.jpg" alt="Xtruck OHW808 software interface" loading="lazy" />
        </div>
        <div class="overview-copy">
          <p class="eyebrow">Product Overview</p>
          <h2>Designed for heavy-duty and off-highway diagnostic inquiries</h2>
          <p v-for="paragraph in product.overview" :key="paragraph">{{ paragraph }}</p>
          <div class="use-case-list">
            <span v-for="useCase in product.useCases" :key="useCase">{{ useCase }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="coverage" class="section section--dark">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Diagnostic Coverage</p>
          <h2>Coverage categories to confirm before ordering</h2>
          <p>
            Contact our team with the machine brand, model and year to confirm compatibility before
            ordering.
          </p>
        </div>
        <div class="coverage-grid">
          <article v-for="item in product.diagnosticCoverage" :key="item" class="coverage-card">
            <IconGlyph name="shield" />
            <span>{{ item }}</span>
          </article>
        </div>
      </div>
    </section>

    <section id="features" class="section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Features</p>
          <h2>Main function directions</h2>
        </div>
        <div class="feature-grid">
          <article v-for="item in product.features" :key="item.title" class="feature-card">
            <IconGlyph :name="item.icon" />
            <h3>{{ item.title }}</h3>
            <p class="feature-card__summary">{{ item.summary }}</p>
            <p>{{ item.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="specifications" class="section section--muted">
      <div class="section-shell split-section">
        <div>
          <p class="eyebrow">Specifications</p>
          <h2>Technical specifications</h2>
          <p>
            Confirmed hardware specifications have not been provided yet. This section is ready for
            accurate dimensions, screen, memory, connector, power, and system details when
            available.
          </p>
        </div>
        <div class="notice-panel">
          <strong>Need exact specs?</strong>
          <p>
            Send your application requirements to Xtruck and ask for the official OHW808 technical
            sheet before ordering.
          </p>
        </div>
      </div>
    </section>

    <section id="videos" class="section section--muted">
      <div class="section-shell video-layout">
        <div>
          <p class="eyebrow">Product Video</p>
          <h2>OHW808 demo video</h2>
          <p>
            Local HTML5 video is included with browser controls. It does not autoplay with sound.
          </p>
        </div>
        <video class="product-video" controls preload="metadata" poster="/images/ohw808-ui.jpg">
          <source src="/videos/ohw808-demo.mp4" type="video/mp4" />
          Product video could not be loaded. Please contact Xtruck for the latest demo media.
        </video>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Why Choose OHW808</p>
          <h2>Focused information for professional diagnostic buyers</h2>
        </div>
        <div class="feature-grid feature-grid--four">
          <article v-for="item in product.whyChoose" :key="item.title" class="feature-card">
            <IconGlyph :name="item.icon" />
            <h3>{{ item.title }}</h3>
            <p class="feature-card__summary">{{ item.summary }}</p>
            <p>{{ item.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="faq" class="section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2>Common questions</h2>
        </div>
        <div class="faq-list">
          <details v-for="item in product.faqs" :key="item.question" class="faq-item">
            <summary>
              <span>{{ item.category }}</span>
              {{ item.question }}
            </summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <section id="contact" class="section section--dark contact-section">
      <div class="section-shell contact-layout">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Contact our Xtruck team</h2>
          <p>
            Ask about product details, compatibility confirmation, software questions, technical
            support, and ordering next steps.
          </p>
          <ul class="contact-list">
            <li>Product inquiry</li>
            <li>Compatibility confirmation</li>
            <li>Software and technical support</li>
          </ul>
        </div>
        <div class="contact-box">
          <WhatsAppButton label="Start WhatsApp Inquiry" />
          <p v-if="siteConfig.contactEmail">
            Email:
            <a :href="`mailto:${siteConfig.contactEmail}`">{{ siteConfig.contactEmail }}</a>
          </p>
          <p v-else>Email contact will be added after confirmation.</p>
        </div>
      </div>
    </section>
  </main>
</template>
