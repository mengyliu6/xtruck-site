<script setup lang="ts">
import { siteConfig } from '@/config/site'
</script>

<template>
  <footer class="site-footer">
    <div class="section-shell site-footer__inner">
      <a href="#top" class="brand-mark brand-mark--footer" aria-label="Xtruck home">
        <span class="brand-mark__symbol">X</span>
        <span>{{ siteConfig.brandName }}</span>
      </a>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="#overview">OHW808 Product</a>
        <a href="#downloads">Downloads</a>
        <a href="#faq">Support</a>
        <a href="#contact">Contact</a>
        <a href="#" aria-label="Privacy Policy placeholder">Privacy Policy</a>
      </nav>
      <p>
        Copyright © {{ new Date().getFullYear() }} {{ siteConfig.brandName }}. All rights reserved.
      </p>
    </div>
  </footer>
</template>
