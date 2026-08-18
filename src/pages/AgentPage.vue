<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import { siteConfig } from '@/config/site'

const partnerProfiles = [
  'Diagnostic equipment distributors',
  'Construction and agricultural service networks',
  'Regional automotive aftermarket suppliers',
]

const partnershipBenefits = [
  {
    title: 'Professional Product Platform',
    description:
      'Represent a purpose-built diagnostic tool for off-highway, construction, agricultural and diesel equipment service.',
    icon: 'screen' as const,
  },
  {
    title: 'Commercial Cooperation',
    description:
      'Distributor terms are discussed around your market, channel plan and expected order volume.',
    icon: 'document' as const,
  },
  {
    title: 'Market Customization',
    description:
      'Interface language, vehicle-brand coverage and function configuration can be evaluated for local requirements.',
    icon: 'toolbox' as const,
  },
  {
    title: 'Training & Technical Support',
    description:
      'Receive product onboarding, operating guidance and coordinated technical assistance for customer support.',
    icon: 'remote' as const,
  },
  {
    title: 'Marketing Resources',
    description:
      'Use coordinated product images, brochures, videos and technical information for regional promotion.',
    icon: 'download' as const,
  },
]

const cooperationSteps = [
  {
    title: 'Introduce Your Market',
    description:
      'Tell us your region, customer base, sales channels and current diagnostic portfolio.',
  },
  {
    title: 'Confirm Market Fit',
    description:
      'We review product coverage, localization needs and suitable cooperation scope together.',
  },
  {
    title: 'Build the Cooperation Plan',
    description: 'Discuss pricing, order planning, technical preparation and marketing resources.',
  },
  {
    title: 'Launch with Support',
    description:
      'Begin regional promotion with coordinated product, training and technical support.',
  },
]
</script>

<template>
  <main class="agent-page">
    <section class="agent-hero" aria-labelledby="agent-title">
      <img
        class="agent-hero__product"
        src="/images/product/ohw808-complete-set.jpg"
        alt="Xtruck OHW808 diagnostic tablet and VCI"
        loading="eager"
        fetchpriority="high"
      />
      <div class="section-shell agent-hero__inner">
        <div class="agent-hero__copy">
          <p class="eyebrow">Official Launch | August 2026</p>
          <h1 id="agent-title">Grow Your Market with Xtruck OHW808</h1>
          <p>
            Xtruck is welcoming reliable agents and distributors to develop long-term regional
            partnerships for professional equipment diagnostics.
          </p>
          <div class="agent-hero__actions">
            <WhatsAppButton label="Discuss Partnership" />
            <a class="button button--secondary" :href="`mailto:${siteConfig.contactEmail}`">
              Email Our Team
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="partner-fit" aria-label="Suitable partner profiles">
      <div class="section-shell partner-fit__inner">
        <strong>Who we work with</strong>
        <span v-for="profile in partnerProfiles" :key="profile">{{ profile }}</span>
      </div>
    </section>

    <section class="section">
      <div class="section-shell">
        <div class="section-heading agent-heading">
          <p class="eyebrow">Partnership Advantages</p>
          <h2>A Practical Foundation for Regional Growth</h2>
          <p>
            The program combines a focused professional product with the commercial, technical and
            market resources needed to serve customers with confidence.
          </p>
        </div>
        <div class="agent-benefits" aria-label="Agent partnership advantages">
          <article v-for="benefit in partnershipBenefits" :key="benefit.title">
            <IconGlyph :name="benefit.icon" />
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section agent-production" aria-labelledby="agent-production-title">
      <div class="section-shell">
        <div class="section-heading agent-production__heading">
          <div>
            <p class="eyebrow">Production &amp; Preparation</p>
            <h2 id="agent-production-title">A Closer Look at the Team Behind OHW808</h2>
          </div>
          <p>
            From production coordination to device inspection and batch preparation, our team works
            directly with the hardware our partners depend on.
          </p>
        </div>
        <div class="agent-production__gallery">
          <figure class="agent-production__feature">
            <img
              src="/images/agent/factory-production-line.jpg"
              alt="Xtruck production line and assembly workstations"
              loading="lazy"
            />
            <figcaption>
              <strong>Production coordination</strong>
              <span>Organized workstations for product assembly and preparation.</span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="/images/agent/factory-device-testing.jpg"
              alt="Xtruck technician inspecting an OHW808 diagnostic tablet"
              loading="lazy"
            />
            <figcaption>
              <strong>Device inspection</strong>
              <span>Hands-on checking of OHW808 hardware and software.</span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="/images/agent/factory-batch-testing.jpg"
              alt="Multiple diagnostic tablets prepared for batch testing"
              loading="lazy"
            />
            <figcaption>
              <strong>Batch preparation</strong>
              <span>Multiple devices organized for verification and delivery preparation.</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--dark agent-customization">
      <div class="section-shell agent-customization__layout">
        <div>
          <p class="eyebrow">Localization Support</p>
          <h2>Adapt OHW808 to Your Market</h2>
          <p>
            Local markets differ in language, equipment population and workshop priorities. Our team
            can evaluate practical customization requirements as part of the cooperation plan.
          </p>
          <ul>
            <li>Interface language customization</li>
            <li>Target vehicle-brand coverage</li>
            <li>Function configuration for regional needs</li>
          </ul>
        </div>
        <div class="agent-customization__image">
          <img
            src="/images/product/ohw808-complete-set.jpg"
            alt="Xtruck OHW808 tablet and VCI prepared for professional diagnostics"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="section-shell">
        <div class="section-heading agent-heading">
          <p class="eyebrow">Cooperation Process</p>
          <h2>A Clear Path from Inquiry to Market Launch</h2>
        </div>
        <ol class="cooperation-steps">
          <li v-for="(step, index) in cooperationSteps" :key="step.title">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section agent-inquiry">
      <div class="section-shell agent-inquiry__inner">
        <div>
          <p class="eyebrow">Start Your Cooperation Journey</p>
          <h2>Tell Us About Your Market</h2>
          <p>
            Contact our team for product details, official pricing, ordering guidance and regional
            cooperation terms.
          </p>
        </div>
        <div class="agent-inquiry__contact">
          <span>Phone &amp; WhatsApp</span>
          <strong>{{ siteConfig.whatsappDisplayNumber }}</strong>
          <a :href="`mailto:${siteConfig.contactEmail}`">{{ siteConfig.contactEmail }}</a>
          <WhatsAppButton label="Contact Xtruck" />
        </div>
      </div>
    </section>
  </main>
</template>
