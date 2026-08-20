<script setup lang="ts">
import IconGlyph from '@/components/common/IconGlyph.vue'
import PreviewImage from '@/components/common/PreviewImage.vue'

const productFamilies = [
  {
    title: 'Volvo Trucks',
    reference: 'Representative line: Volvo FH',
    image: '/images/brands/volvo/families/volvo-trucks.jpg',
    alt: 'European cab-over heavy-duty truck representing the Volvo FH product line',
  },
  {
    title: 'Volvo Construction Equipment',
    reference: 'Representative line: Volvo EC Series',
    image: '/images/brands/volvo/families/volvo-construction-equipment.jpg',
    alt: 'Crawler excavator representing the Volvo EC Series construction equipment line',
  },
  {
    title: 'Volvo OEM Component Customer',
    reference: 'Representative line: Volvo Penta Industrial',
    image: '/images/brands/volvo/families/volvo-oem-components.jpg',
    alt: 'Industrial inline-six engine power unit representing Volvo Penta OEM applications',
  },
  {
    title: 'Renault Trucks',
    reference: 'Representative line: Renault Trucks T',
    image: '/images/brands/volvo/families/renault-trucks.jpg',
    alt: 'European high-roof cab-over truck representing the Renault Trucks T product line',
  },
  {
    title: 'Shandong Lingong Construction Machinery Co., Ltd.',
    reference: 'Representative line: SDLG Wheel Loader',
    image: '/images/brands/volvo/families/shandong-lingong.jpg',
    alt: 'Articulated wheel loader representing Shandong Lingong SDLG construction machinery',
  },
  {
    title: 'UD Trucks',
    reference: 'Representative line: UD Quon',
    image: '/images/brands/volvo/families/ud-trucks.jpg',
    alt: 'Japanese cab-over heavy-duty truck representing the UD Quon product line',
  },
]

const diagnosticWorkflow = [
  {
    title: 'Choose the Connection',
    description: 'Select the connector that matches the target Volvo vehicle or equipment.',
    image: '/images/brands/volvo/protocol-selection.png',
    alt: 'OHW808 Volvo connector selection screen',
  },
  {
    title: 'Scan the J1708 Network',
    description: 'Identify available control modules across the connected J1708 network.',
    image: '/images/brands/volvo/j1708-system-topology.png',
    alt: 'OHW808 Volvo J1708 control-system topology screen',
  },
  {
    title: 'Review Fault Status',
    description: 'See detected control systems and fault counts before opening diagnostics.',
    image: '/images/brands/volvo/j1708-fault-scan.png',
    alt: 'OHW808 Volvo J1708 network fault status screen',
  },
]

const coreFunctions = [
  {
    title: 'Read ECU Information',
    description: 'Read and display available ECU version and identification information.',
    icon: 'engine' as const,
    image: '/images/brands/volvo/ecu-information.png',
    alt: 'Volvo ECU identification information displayed by OHW808',
  },
  {
    title: 'Read DTCs',
    description: 'Retrieve diagnostic trouble codes from the selected control system.',
    icon: 'document' as const,
    image: '/images/brands/volvo/fault-codes.png',
    alt: 'Volvo diagnostic trouble codes displayed by OHW808',
  },
  {
    title: 'Clear DTCs',
    description: 'Clear supported diagnostic trouble codes after the fault is resolved.',
    icon: 'toolbox' as const,
    image: '/images/brands/volvo/clear-dtc-success.png',
    alt: 'OHW808 confirmation after clearing Volvo diagnostic trouble codes',
  },
  {
    title: 'Read Live Data',
    description: 'Display available real-time data streams for diagnostic analysis.',
    icon: 'database' as const,
    image: '/images/brands/volvo/live-data-overview.png',
    alt: 'Volvo live data values displayed by OHW808',
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

const liveDataViews = [
  {
    title: 'Engine Operating Values',
    description: 'Review torque, pressure, temperature and turbocharger values together.',
    image: '/images/brands/volvo/live-data-engine-values.png',
    alt: 'OHW808 Volvo engine operating live data values',
  },
  {
    title: 'Operating Totals',
    description: 'Inspect engine speed, vehicle distance, engine hours and related totals.',
    image: '/images/brands/volvo/live-data-operating-totals.png',
    alt: 'OHW808 Volvo operating totals and live data values',
  },
  {
    title: 'Live Data Graph',
    description: 'Plot selected parameters to make changing values easier to compare.',
    image: '/images/brands/volvo/live-data-graph.png',
    alt: 'OHW808 Volvo live data graph view',
  },
  {
    title: 'Parameter Comparison',
    description: 'Compare multiple live parameters in one visual diagnostic view.',
    image: '/images/brands/volvo/live-data-comparison.png',
    alt: 'OHW808 Volvo live parameter comparison graph',
  },
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
          <li v-for="(family, index) in productFamilies" :key="family.title">
            <div class="brand-family-list__media">
              <img :src="family.image" :alt="family.alt" loading="lazy" />
            </div>
            <div class="brand-family-list__content">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <strong>{{ family.title }}</strong>
                <small>{{ family.reference }}</small>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section section--muted" aria-labelledby="volvo-workflow-title">
      <div class="section-shell">
        <div class="section-heading section-heading--compact">
          <p class="eyebrow">Volvo J1708 Workflow</p>
          <h2 id="volvo-workflow-title">From Connection to System Scan</h2>
          <p>
            Follow the on-screen workflow to identify the connection and available control systems.
          </p>
        </div>
        <div class="brand-workflow-grid">
          <article v-for="(step, index) in diagnosticWorkflow" :key="step.title">
            <PreviewImage class="brand-ui-shot" :src="step.image" :alt="step.alt" />
            <div class="brand-workflow-grid__body">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="volvo-core-functions-title">
      <div class="section-shell">
        <div class="section-heading">
          <p class="eyebrow">Core Diagnostics</p>
          <h2 id="volvo-core-functions-title">Four Fundamental Diagnostic Functions</h2>
        </div>
        <div class="brand-core-grid">
          <article v-for="item in coreFunctions" :key="item.title">
            <PreviewImage class="brand-ui-shot" :src="item.image" :alt="item.alt" />
            <div class="brand-core-grid__body">
              <IconGlyph :name="item.icon" />
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
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
          <figure class="brand-protocol-visual">
            <PreviewImage
              class="brand-ui-shot"
              src="/images/brands/volvo/diagnostic-function-menu.png"
              alt="OHW808 Volvo diagnostic function menu"
            />
            <figcaption>
              Available function groups for the selected Volvo control system.
            </figcaption>
          </figure>
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
          <p class="eyebrow">Live Data Analysis</p>
          <h2 id="volvo-media-title">Live Data and Graph Views</h2>
          <p>Inspect detailed values or switch to graph views for visual comparison.</p>
        </div>
        <div class="brand-media-grid">
          <article v-for="view in liveDataViews" :key="view.title" class="brand-media-card">
            <PreviewImage class="brand-ui-shot" :src="view.image" :alt="view.alt" />
            <div class="brand-media-card__body">
              <h3>{{ view.title }}</h3>
              <p>{{ view.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
