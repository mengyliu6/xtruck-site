<script setup lang="ts">
import { computed, ref } from 'vue'

import IconGlyph from '@/components/common/IconGlyph.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { siteConfig } from '@/config/site'
import { buildCoverageDirectory, coverageFilters, type CoverageCategory } from '@/data/coverage'
import { product } from '@/data/product'

const coverageBrands = buildCoverageDirectory(product.coverageGroups)
const coverageCategory = ref<CoverageCategory>('all')
const coverageQuery = ref('')
const availableSupportListCount = coverageBrands.filter((brand) => brand.downloadHref).length

const visibleCoverageBrands = computed(() => {
  const query = coverageQuery.value.trim().toLocaleLowerCase()
  return coverageBrands.filter((brand) => {
    const categoryMatches =
      coverageCategory.value === 'all' || brand.category === coverageCategory.value
    const queryMatches = !query || brand.name.toLocaleLowerCase().includes(query)
    return categoryMatches && queryMatches
  })
})
</script>

<template>
  <main>
    <section class="capability-banner" aria-labelledby="capability-banner-title">
      <div class="section-shell capability-banner__inner">
        <div class="capability-banner__copy">
          <p class="eyebrow">Professional Factory-Grade Diagnostics</p>
          <h2 id="capability-banner-title">Off-Highway &amp; Agricultural Vehicle Scanner</h2>
          <p>
            Built for professional service teams working with construction machinery, agricultural
            equipment and diesel engines.
          </p>
          <div class="capability-banner__features">
            <div>
              <IconGlyph name="machine" />
              <span>100+ Brands</span>
              <small>Coverage</small>
            </div>
            <div>
              <IconGlyph name="shield" />
              <span>Factory-Level</span>
              <small>Access</small>
            </div>
            <div>
              <IconGlyph name="database" />
              <span>Real-Time</span>
              <small>Live Data</small>
            </div>
            <div>
              <IconGlyph name="remote" />
              <span>Remote</span>
              <small>Support</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <nav class="product-section-nav" aria-label="OHW808 product sections">
      <div class="section-shell product-section-nav__inner">
        <a href="#features">Functions</a>
        <a href="#coverage">Coverage</a>
        <a href="#workflow">Workflow</a>
        <a href="#specifications">Specifications</a>
        <a href="#download">Download</a>
        <a href="#video">Video</a>
      </div>
    </nav>

    <section id="overview" class="section section--overview">
      <div class="section-shell overview-layout">
        <div class="overview-copy">
          <p class="eyebrow">Product Overview</p>
          <h2>Built for Professional Off-Highway Service Work</h2>
          <p v-for="paragraph in product.overview" :key="paragraph">{{ paragraph }}</p>
        </div>
        <div class="overview-side">
          <h3>Who it is for</h3>
          <ul class="audience-list">
            <li v-for="useCase in product.useCases" :key="useCase">{{ useCase }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="features" class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Diagnostic Functions</p>
          <h2>Core Functions in One Diagnostic Workflow</h2>
          <p>
            Available functions depend on the selected manufacturer, equipment model and control
            system.
          </p>
        </div>
        <div class="diagnostic-grid">
          <article v-for="item in product.features" :key="item.title" class="diagnostic-item">
            <PreviewImage v-if="item.image" :src="item.image" :alt="item.imageAlt || item.title" />
            <div v-else class="diagnostic-item__placeholder" aria-hidden="true">
              <IconGlyph :name="item.icon" />
            </div>
            <div>
              <IconGlyph :name="item.icon" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="coverage" class="section section--dark">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Equipment Coverage</p>
          <h2>Construction, Agriculture, Engines and HD OBD</h2>
          <p>
            OHW808 covers international and Chinese construction machinery, agricultural equipment,
            diesel engines and heavy-duty OBD diagnostics.
          </p>
        </div>

        <div class="coverage-categories">
          <article v-for="group in product.coverageGroups" :key="group.title">
            <IconGlyph :name="group.icon" />
            <h3>{{ group.title }}</h3>
            <p>{{ group.brands.length }} listed option{{ group.brands.length === 1 ? '' : 's' }}</p>
          </article>
        </div>

        <div id="coverage-directory" class="coverage-directory">
          <div class="coverage-directory__header">
            <div>
              <p class="coverage-directory__eyebrow">Brand Directory</p>
              <h3>All supported brands</h3>
              <p>
                {{ coverageBrands.length }} unique entries, ordered by global brand recognition.
              </p>
            </div>
            <label class="coverage-search">
              <span>Search brands</span>
              <input v-model="coverageQuery" type="search" placeholder="Enter a brand name" />
            </label>
          </div>

          <div class="coverage-filters" role="group" aria-label="Filter supported brands">
            <button
              v-for="filter in coverageFilters"
              :key="filter.value"
              type="button"
              :aria-pressed="coverageCategory === filter.value"
              @click="coverageCategory = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="coverage-file-status">
            <strong>{{ availableSupportListCount }} support lists available</strong>
            <span>More brand support-list PDFs are being prepared.</span>
          </div>

          <div v-if="visibleCoverageBrands.length" class="coverage-brand-grid">
            <article v-for="brand in visibleCoverageBrands" :key="brand.name">
              <div class="coverage-brand__identity">
                <h4>{{ brand.name }}</h4>
                <span>{{ brand.categoryLabel }}</span>
              </div>
              <a
                v-if="brand.downloadHref"
                class="coverage-brand__download"
                :href="brand.downloadHref"
                :download="brand.downloadName"
                :aria-label="`Download ${brand.name} support list PDF`"
                title="Download support list PDF"
              >
                <IconGlyph name="download" />
                <span>Support list</span>
              </a>
              <span v-else class="coverage-brand__pending" title="Support list PDF coming soon">
                <IconGlyph name="document" />
                <span>PDF pending</span>
              </span>
            </article>
          </div>
          <p v-else class="coverage-empty">No supported brands match this search.</p>
        </div>

        <div class="compatibility-note">
          <div class="compatibility-note__heading">
            <span>Compatibility check</span>
            <strong>Confirm your equipment before ordering</strong>
          </div>
          <ol class="compatibility-steps">
            <li><span>01</span>Equipment brand &amp; model</li>
            <li><span>02</span>Year &amp; engine model</li>
            <li><span>03</span>Required diagnostic functions</li>
          </ol>
          <WhatsAppButton label="Confirm Compatibility" />
        </div>
      </div>
    </section>

    <section id="workflow" class="section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Diagnostic Workflow</p>
          <h2>Cummins Diagnostic Example</h2>
          <p>A clear four-step path from engine selection to the main diagnostic interface.</p>
        </div>
        <ol class="workflow-grid">
          <li v-for="(step, index) in product.workflow" :key="step.title">
            <PreviewImage v-if="step.image" :src="step.image" :alt="step.imageAlt || step.title" />
            <div class="workflow-step__copy">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section id="tools" class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Additional Tools</p>
          <h2>Support Functions for Daily Service Work</h2>
        </div>
        <div class="tool-list">
          <article v-for="item in product.additionalTools" :key="item.title">
            <PreviewImage v-if="item.image" :src="item.image" :alt="item.imageAlt || item.title" />
            <div>
              <IconGlyph :name="item.icon" />
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="specifications" class="section specs-section">
      <div class="section-shell">
        <div class="specs-heading">
          <div>
            <p class="eyebrow">Specifications</p>
            <h2>OHW808 Hardware</h2>
          </div>
          <p>Professional-grade hardware for demanding workshop and field diagnostic work.</p>
        </div>
        <dl class="spec-grid">
          <div v-for="item in product.specs" :key="item.label" class="spec-item">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
          <div class="spec-item spec-item--languages">
            <dt>Supported Languages</dt>
            <dd>{{ product.languages.join(', ') }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="package" class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Package Contents</p>
          <h2>Equipment, Cables and Accessories</h2>
          <p>Check the included equipment, diagnostic cables and accessories.</p>
        </div>
        <div class="package-grid">
          <section v-for="group in product.packageGroups" :key="group.title">
            <h3>{{ group.title }}</h3>
            <ul>
              <li v-for="item in group.items" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <section id="download" class="section resource-section">
      <div class="section-shell resource-layout">
        <div class="section-heading">
          <p class="eyebrow">Download</p>
          <h2>Official OHW808 Resources</h2>
          <p>
            Download the English user manual or contact Xtruck for the latest support list and
            software assistance.
          </p>
          <WhatsAppButton label="Contact for More Files" />
        </div>
        <div class="resource-list">
          <article v-for="resource in product.resources" :key="resource.title">
            <IconGlyph name="document" />
            <div>
              <h3>{{ resource.title }}</h3>
              <p>{{ resource.description }}</p>
            </div>
            <a
              v-if="resource.href"
              class="resource-action"
              :href="resource.href"
              :download="resource.downloadName"
            >
              <IconGlyph name="download" />
              {{ resource.actionLabel ?? 'Download' }}
            </a>
            <a
              v-else-if="resource.title === 'Equipment Support List'"
              class="resource-action"
              href="#coverage-directory"
            >
              View Support Lists
            </a>
            <span v-else>Contact Xtruck</span>
          </article>
        </div>
      </div>
    </section>

    <section id="video" class="section section--dark video-section">
      <div class="section-shell video-layout">
        <div>
          <p class="eyebrow">Video</p>
          <h2>See OHW808 in Operation</h2>
          <p>
            Watch the product demonstration to review the tablet interface and diagnostic workflow.
          </p>
        </div>
        <video
          class="product-video"
          controls
          preload="metadata"
          poster="/images/ui/ohw808-home.png"
        >
          <source src="/videos/ohw808-demo.mp4" type="video/mp4" />
          Your browser does not support the OHW808 product video.
        </video>
      </div>
    </section>

    <section id="faq" class="section">
      <div class="section-shell faq-layout">
        <div class="section-heading">
          <p class="eyebrow">Q&amp;A</p>
          <h2>Using, Updating and Supporting OHW808</h2>
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
          <p class="eyebrow">Before You Order</p>
          <h2>Need to Confirm OHW808 Compatibility?</h2>
          <p>Send us your equipment details and our team will help you verify before ordering.</p>
          <ul class="contact-list">
            <li>Equipment brand and model</li>
            <li>Year and engine model</li>
            <li>Required diagnostic functions</li>
          </ul>
        </div>
        <div class="contact-box">
          <p class="contact-box__label">WhatsApp Sales</p>
          <strong>{{ siteConfig.whatsappDisplayNumber }}</strong>
          <p>Use the prepared message to send your machine and diagnostic details.</p>
          <WhatsAppButton label="Send Equipment Details" />
          <p v-if="siteConfig.contactEmail">
            Email: <a :href="`mailto:${siteConfig.contactEmail}`">{{ siteConfig.contactEmail }}</a>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
