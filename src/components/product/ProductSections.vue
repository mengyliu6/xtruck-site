<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { siteConfig } from '@/config/site'
import { product } from '@/data/product'

const primaryBrands = [
  'Bobcat',
  'Caterpillar Pro',
  'Case',
  'JCB',
  'Komatsu',
  'Kubota',
  'Volvo Construction Machinery',
  'Hitachi Machinery',
  'Hyundai',
  'John Deere',
  'New Holland',
  'Fendt',
  'Claas',
  'Massey Ferguson',
  'XCMG',
  'SANY Heavy Industry',
  'LiuGong Machinery',
  'Shandong Shantui',
  'Zoomlion Heavy Industry',
  'Yuchai Machinery',
]
</script>

<template>
  <main>
    <section id="overview" class="section section--overview">
      <div class="section-shell overview-layout">
        <div class="overview-copy">
          <p class="eyebrow">Product Overview</p>
          <h2>Built for professional off-highway service work</h2>
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
          <h2>Core functions in one diagnostic workflow</h2>
          <p>
            Available functions depend on the selected manufacturer, equipment model and control
            system.
          </p>
        </div>
        <div class="diagnostic-grid">
          <article v-for="item in product.features" :key="item.title" class="diagnostic-item">
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

    <section id="coverage" class="section section--dark">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Equipment Coverage</p>
          <h2>Construction, agriculture, engines and HD OBD</h2>
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

        <div class="brand-panel" aria-label="Primary supported brands">
          <span v-for="brand in primaryBrands" :key="brand">{{ brand }}</span>
        </div>

        <details class="coverage-details">
          <summary>View Full Coverage</summary>
          <div class="coverage-details__grid">
            <section v-for="group in product.coverageGroups" :key="group.title">
              <h3>{{ group.title }}</h3>
              <ul>
                <li v-for="brand in group.brands" :key="brand">{{ brand }}</li>
              </ul>
            </section>
          </div>
        </details>

        <div class="compatibility-note">
          <strong>Not sure about compatibility?</strong>
          <p>
            Send us the equipment brand, model, year, engine model and diagnostic requirements on
            WhatsApp before ordering.
          </p>
          <WhatsAppButton label="Confirm Compatibility" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Diagnostic Workflow</p>
          <h2>Cummins diagnostic example</h2>
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

    <section class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Additional Tools</p>
          <h2>Support functions for daily service work</h2>
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

    <section id="specifications" class="section">
      <div class="section-shell specs-layout">
        <div>
          <p class="eyebrow">Specifications</p>
          <h2>OHW808 hardware</h2>
          <p class="section-intro">
            Professional-grade hardware for demanding workshop and field diagnostic work.
          </p>
          <div class="language-panel">
            <h3>Supported Languages</h3>
            <ul>
              <li v-for="language in product.languages" :key="language">{{ language }}</li>
            </ul>
          </div>
        </div>
        <div class="spec-table-wrap">
          <table class="spec-table">
            <tbody>
              <tr v-for="item in product.specs" :key="item.label">
                <th scope="row">{{ item.label }}</th>
                <td>{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="package" class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Package Contents</p>
          <h2>Equipment, cables and accessories</h2>
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
          <h2>Official OHW808 resources</h2>
          <p>
            Request the latest documents from Xtruck so the files match your device and software
            version.
          </p>
          <WhatsAppButton label="Request Official Files" />
        </div>
        <div class="resource-list">
          <article v-for="resource in product.resources" :key="resource.title">
            <IconGlyph name="document" />
            <div>
              <h3>{{ resource.title }}</h3>
              <p>{{ resource.description }}</p>
            </div>
            <span>Contact Xtruck</span>
          </article>
        </div>
      </div>
    </section>

    <section id="video" class="section section--dark video-section">
      <div class="section-shell video-layout">
        <div>
          <p class="eyebrow">Video</p>
          <h2>See OHW808 in operation</h2>
          <p>
            Watch the product demonstration to review the tablet interface and diagnostic workflow.
          </p>
        </div>
        <video class="product-video" controls preload="metadata" poster="/images/ohw808-ui.jpg">
          <source src="/videos/ohw808-demo.mp4" type="video/mp4" />
          Your browser does not support the OHW808 product video.
        </video>
      </div>
    </section>

    <section id="agent" class="section agent-section">
      <div class="section-shell agent-layout">
        <div>
          <p class="eyebrow">Agent</p>
          <h2>Become an Xtruck OHW808 agent</h2>
          <p>
            Contact Xtruck to discuss regional distribution, product information, compatibility
            support and after-sales coordination.
          </p>
        </div>
        <div class="agent-panel">
          <span>Distribution inquiry</span>
          <strong>{{ siteConfig.whatsappDisplayNumber }}</strong>
          <a class="contact-email" :href="`mailto:${siteConfig.contactEmail}`">
            {{ siteConfig.contactEmail }}
          </a>
          <WhatsAppButton label="Contact Xtruck" />
        </div>
      </div>
    </section>

    <section id="blog" class="section section--muted">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Blog</p>
          <h2>OHW808 service guides</h2>
          <p>Practical guides for diagnostics, remote assistance and device maintenance.</p>
        </div>
        <div class="article-list">
          <article v-for="article in product.articles" :key="article.title">
            <h3>{{ article.title }}</h3>
            <p>{{ article.description }}</p>
            <ul>
              <li v-for="point in article.points" :key="point">{{ point }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section id="faq" class="section">
      <div class="section-shell faq-layout">
        <div class="section-heading">
          <p class="eyebrow">Q&amp;A</p>
          <h2>Using, updating and supporting OHW808</h2>
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
          <h2>Need to confirm OHW808 compatibility?</h2>
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
