<script setup lang="ts">
import WhatsAppButton from '@/components/common/WhatsAppButton.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'
import { formatPrice } from '@/config/site'
import { product } from '@/data/product'
</script>

<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="section-shell home-hero__inner">
        <div class="home-hero__copy">
          <p class="eyebrow">Professional Off-Highway Diagnostics</p>
          <h1>One professional tool for demanding equipment diagnostics.</h1>
          <p>
            Xtruck supports service teams working with construction machinery, agricultural
            equipment and diesel engines.
          </p>
          <a class="button button--primary" href="/product/ohw808">View OHW808</a>
        </div>
      </div>
    </section>

    <section class="section featured-product" aria-labelledby="featured-product-heading">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Featured Product</p>
          <h2 id="featured-product-heading">Professional diagnosis, clearly presented.</h2>
          <p>Review the product, confirm compatibility and choose your preferred payment method.</p>
        </div>

        <a class="product-card" href="/product/ohw808" aria-label="View Xtruck OHW808 product">
          <div class="product-card__image">
            <PreviewImage
              src="/images/ohw808-device.jpg"
              alt="Xtruck OHW808 diagnostic tablet on a white background"
              loading="eager"
            />
          </div>
          <div class="product-card__copy">
            <span class="product-card__label">Xtruck Diagnostic Tool</span>
            <h2>{{ product.name }}</h2>
            <p>{{ product.summary }}</p>
            <strong>{{ formatPrice(product.priceUsd) }}</strong>
            <span class="product-card__link">View product and payment options →</span>
          </div>
        </a>
      </div>
    </section>

    <section id="contact" class="section section--dark home-contact">
      <div class="section-shell home-contact__inner">
        <div>
          <p class="eyebrow">Before Ordering</p>
          <h2>Not sure whether OHW808 supports your equipment?</h2>
          <p>Send the equipment brand, model, year, engine and required function to our team.</p>
        </div>
        <WhatsAppButton label="Confirm on WhatsApp" />
      </div>
    </section>
  </main>
</template>
