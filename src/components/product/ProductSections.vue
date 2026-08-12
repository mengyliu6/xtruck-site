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
        <div class="section-heading">
          <p class="eyebrow">Resources</p>
          <h2>Downloads & Resources</h2>
          <p>
            Official files will be linked here when available. Missing resources are marked Coming
            Soon instead of sending customers to fake files.
          </p>
        </div>
        <div class="download-grid">
          <article v-for="item in product.downloads" :key="item.name" class="download-card">
            <IconGlyph name="document" />
            <h3>{{ item.name }}</h3>
            <dl>
              <div>
                <dt>Type</dt>
                <dd>{{ item.type }}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{{ item.size || 'Pending' }}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{{ item.version || 'Pending' }}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{{ item.updated || 'Pending' }}</dd>
              </div>
            </dl>
            <a
              v-if="item.status === 'available' && item.href"
              :href="item.href"
              class="button button--secondary"
              download
            >
              Download
            </a>
            <span v-else class="status-pill">Coming Soon</span>
          </article>
        </div>
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
          <h2>Support brands and diagnostic scope</h2>
          <p>
            Covers 100+ brands construction and agricultural machinery models. Contact our team with
            the machine brand, model and year to confirm compatibility before ordering.
          </p>
        </div>
        <div class="coverage-grid">
          <article v-for="item in product.diagnosticCoverage" :key="item" class="coverage-card">
            <IconGlyph name="shield" />
            <span>{{ item }}</span>
          </article>
        </div>
        <div class="brand-panel" aria-label="Supported brands">
          <span v-for="brand in product.supportBrands" :key="brand">{{ brand }}</span>
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

    <section class="section">
      <div class="section-shell update-layout">
        <div>
          <p class="eyebrow">Update Log</p>
          <h2>Xtruck OHW808 update list</h2>
          <p>
            The following diagnostic list versions are based on the latest supplied product
            information. Official files can be linked in Downloads when provided.
          </p>
        </div>
        <div class="update-list" aria-label="Xtruck OHW808 update log">
          <article v-for="item in product.updateLog" :key="`${item.brand}-${item.version}`">
            <span>{{ item.brand }}</span>
            <strong>{{ item.version }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell detail-outline">
        <div class="section-heading">
          <p class="eyebrow">Product Details</p>
          <h2>Detail content to be expanded</h2>
          <p>
            The next Word document can be mapped into these sections, with image and text layout
            added after the official content is provided.
          </p>
        </div>
        <ol>
          <li v-for="item in product.detailOutline" :key="item">{{ item }}</li>
        </ol>
      </div>
    </section>

    <section id="videos" class="section">
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
