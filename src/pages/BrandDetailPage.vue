<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'

const productFamilies = [
  'Volvo Trucks',
  'Volvo Construction Equipment',
  'Volvo OEM Component Customer',
  'Renault Trucks',
  'Shandong Lingong Construction Machinery Co., Ltd.',
  'UD Trucks',
]

const coreFunctions = [
  {
    title: 'Read ECU Information',
    description: 'Read and display available ECU version and identification information.',
    icon: 'engine' as const,
  },
  {
    title: 'Read DTCs',
    description: 'Retrieve diagnostic trouble codes from the selected control system.',
    icon: 'document' as const,
  },
  {
    title: 'Clear DTCs',
    description: 'Clear supported diagnostic trouble codes after the fault is resolved.',
    icon: 'toolbox' as const,
  },
  {
    title: 'Read Live Data',
    description: 'Display available real-time data streams for diagnostic analysis.',
    icon: 'database' as const,
  },
]

const j1708Functions = [
  ['Injectors Shut-Off', 'Injector cut-off test'],
  ['Learned Data Reset', 'Reset engine adaptive learned values'],
  ['Cylinder Compression Test', 'Cylinder compression pressure testing'],
  ['Oil Pressure Test During Cranking', 'Oil pressure measurement while cranking the engine'],
  ['Cylinder Balancing Test', 'Cylinder balancing test'],
  ['VGT Calibration', 'Variable-geometry turbocharger calibration'],
  ['Parameter Programming', 'Programming for engine-relevant parameters'],
  ['TECU Actuation Test', 'Actuation test for the TECU'],
]
</script>

<template>
  <main class="brand-page">
    <div class="section-shell brand-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <a href="/#coverage-directory">Brand Coverage</a>
      <span aria-hidden="true">/</span>
      <span>Volvo</span>
    </div>

    <section class="brand-hero" aria-labelledby="volvo-brand-title">
      <div class="section-shell brand-hero__inner">
        <div>
          <p class="eyebrow">Volvo Engine Coverage</p>
          <h1 id="volvo-brand-title">Xtruck OHW808 Volvo Diagnostic Capabilities</h1>
          <p>
            OHW808 supports two Volvo communication protocols: Volvo (J1708) and Volvo (500K), with
            engine-related diagnostics for supported equipment and control systems.
          </p>
          <div class="brand-protocols" aria-label="Supported Volvo protocols">
            <span>Volvo J1708</span>
            <span>Volvo 500K</span>
          </div>
          <div class="brand-hero__actions">
            <a
              class="button button--primary"
              href="/downloads/OHW808%20Function%20for%20VOLVO.pdf"
              download="OHW808 Function for VOLVO.pdf"
            >
              Download Support List
            </a>
          </div>
        </div>
        <aside class="brand-model-note">
          <IconGlyph name="shield" />
          <strong>Model-Dependent Support</strong>
          <p>
            Available advanced functions vary by vehicle, equipment model, ECU and installed control
            system.
          </p>
        </aside>
      </div>
    </section>

    <section class="section brand-families" aria-labelledby="volvo-families-title">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Volvo J1708 Coverage</p>
          <h2 id="volvo-families-title">Covered Product Families</h2>
          <p>Engine-related diagnosis is available for the following product families.</p>
        </div>
        <ol class="brand-family-list">
          <li v-for="(family, index) in productFamilies" :key="family">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ family }}</strong>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section--muted" aria-labelledby="volvo-core-functions-title">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Core Diagnostics</p>
          <h2 id="volvo-core-functions-title">Four Fundamental Diagnostic Functions</h2>
        </div>
        <div class="brand-core-grid">
          <article v-for="item in coreFunctions" :key="item.title">
            <IconGlyph :name="item.icon" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section brand-protocol-section" aria-labelledby="volvo-j1708-title">
      <div class="section-shell brand-protocol-layout">
        <div class="brand-protocol-copy">
          <p class="eyebrow">Volvo J1708</p>
          <h2 id="volvo-j1708-title">Special Engine Service Functions</h2>
          <p>
            The following advanced operations are conditionally supported depending on the target
            model and control system.
          </p>
        </div>
        <dl class="brand-function-list">
          <div v-for="item in j1708Functions" :key="item[0]">
            <dt>{{ item[0] }}</dt>
            <dd>{{ item[1] }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section section--dark brand-500k" aria-labelledby="volvo-500k-title">
      <div class="section-shell brand-500k__layout">
        <div>
          <p class="eyebrow">Volvo 500K</p>
          <h2 id="volvo-500k-title">Engine-Related ECU Performance</h2>
          <p>
            Every supported ECU within the Volvo (500K) system provides the four core diagnostic
            functions listed above.
          </p>
        </div>
        <div class="brand-ecu-list">
          <article>
            <span>01</span>
            <div>
              <h3>Engine Management System</h3>
              <p>
                Core diagnostics plus supported actuation tests, special feature operations and
                parameter programming.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Engine Control Module</h3>
              <p>The four fundamental diagnostic functions are provided.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section brand-media" aria-labelledby="volvo-media-title">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Software &amp; Testing</p>
          <h2 id="volvo-media-title">Volvo Interface and Test Media</h2>
          <p>Verified Volvo interface screenshots and test videos will be added here.</p>
        </div>
        <div class="brand-media-grid">
          <article class="brand-media-placeholder">
            <IconGlyph name="screen" />
            <div>
              <span>Software Interface</span>
              <h3>Volvo Diagnostic UI</h3>
              <p>Interface images are being prepared.</p>
            </div>
          </article>
          <article class="brand-media-placeholder">
            <IconGlyph name="toolbox" />
            <div>
              <span>Diagnostic Test</span>
              <h3>Volvo Test Video</h3>
              <p>Equipment test footage is being prepared.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
