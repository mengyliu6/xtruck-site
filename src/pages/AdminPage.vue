<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

type AdminView = 'dashboard' | 'orders' | 'templates' | 'detail'

interface AdminOrderSummary {
  id: string
  order_number: string
  customer_name: string | null
  customer_email: string | null
  shipping_country: string | null
  product_name: string
  quantity: number
  currency: string
  total_amount: number
  payment_status: string
  fulfillment_status: string
  created_at: string
}

interface AdminOrder extends AdminOrderSummary {
  product_sku: string
  unit_price: number
  subtotal: number
  shipping_amount: number
  payment_provider: string
  paypal_order_id: string | null
  paypal_capture_id: string | null
  customer_phone: string | null
  shipping_address: Record<string, unknown> | null
  shipping_carrier: string | null
  tracking_number: string | null
  confirmation_email_sent_at: string | null
  shipping_email_sent_at: string | null
  updated_at: string
}

interface EmailTemplate {
  key: 'order_confirmation' | 'shipping_update'
  subject: string
  body: string
  updated_at?: string
}

interface DashboardMetrics {
  totalOrders: number
  paidOrders: number
  pendingFulfillment: number
  shippedOrders: number
  totalRevenue: number
}

const authLoading = ref(true)
const authenticated = ref(false)
const activeView = ref<AdminView>('dashboard')
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const credentials = reactive({ password: '', username: '' })
const metrics = ref<DashboardMetrics | null>(null)
const orders = ref<AdminOrderSummary[]>([])
const selectedOrder = ref<AdminOrder | null>(null)
const templates = ref<EmailTemplate[]>([])
const filters = reactive({ fulfillmentStatus: '', paymentStatus: '', search: '' })
const fulfillmentForm = reactive({
  fulfillmentStatus: 'unfulfilled',
  shippingCarrier: '',
  trackingNumber: '',
})

const views: Array<{ key: Exclude<AdminView, 'detail'>; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'orders', label: 'Orders' },
  { key: 'templates', label: 'Email Templates' },
]

const variables = [
  '{{customer_name}}',
  '{{order_number}}',
  '{{product_name}}',
  '{{quantity}}',
  '{{total}}',
  '{{payment_status}}',
  '{{fulfillment_status}}',
  '{{shipping_carrier}}',
  '{{tracking_number}}',
  '{{order_status_url}}',
]

const pageTitle = computed(() => {
  if (activeView.value === 'detail') return selectedOrder.value?.order_number || 'Order Detail'
  return views.find((view) => view.key === activeView.value)?.label || 'Dashboard'
})

async function apiRequest<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  const body = (await response.json().catch(() => ({}))) as T & { error?: string }
  if (!response.ok) throw new Error(body.error || 'The request could not be completed.')
  return body
}

function clearNotices() {
  errorMessage.value = ''
  successMessage.value = ''
}

function formatMoney(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { currency, style: 'currency' }).format(cents / 100)
}

function formatDate(value: string | null) {
  if (!value) return 'Not sent'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatStatus(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatAddress(value: Record<string, unknown> | null) {
  if (!value) return 'Not provided'
  const address = (value.address || {}) as Record<string, unknown>
  return [
    value.name,
    address.address_line_1,
    address.address_line_2,
    address.admin_area_2,
    address.admin_area_1,
    address.postal_code,
    address.country_code,
  ]
    .filter(Boolean)
    .join(', ')
}

async function loadDashboard() {
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ metrics: DashboardMetrics }>('/api/admin/dashboard')
    metrics.value = body.metrics
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load dashboard.'
  } finally {
    busy.value = false
  }
}

async function loadOrders() {
  busy.value = true
  clearNotices()
  try {
    const query = new URLSearchParams({
      fulfillmentStatus: filters.fulfillmentStatus,
      paymentStatus: filters.paymentStatus,
      search: filters.search,
    })
    const body = await apiRequest<{ orders: AdminOrderSummary[] }>(`/api/admin/orders?${query}`)
    orders.value = body.orders
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load orders.'
  } finally {
    busy.value = false
  }
}

async function loadTemplates() {
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ templates: EmailTemplate[] }>('/api/admin/email-templates')
    templates.value = body.templates
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load templates.'
  } finally {
    busy.value = false
  }
}

async function openOrder(id: string) {
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ order: AdminOrder }>(
      `/api/admin/order?id=${encodeURIComponent(id)}`,
    )
    selectedOrder.value = body.order
    fulfillmentForm.fulfillmentStatus = body.order.fulfillment_status
    fulfillmentForm.shippingCarrier = body.order.shipping_carrier || ''
    fulfillmentForm.trackingNumber = body.order.tracking_number || ''
    activeView.value = 'detail'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load order.'
  } finally {
    busy.value = false
  }
}

async function saveFulfillment() {
  if (!selectedOrder.value) return
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ order: AdminOrder }>(
      `/api/admin/order?id=${encodeURIComponent(selectedOrder.value.id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(fulfillmentForm),
      },
    )
    selectedOrder.value = body.order
    successMessage.value = 'Fulfillment details saved.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to update order.'
  } finally {
    busy.value = false
  }
}

async function saveTemplate(template: EmailTemplate) {
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ templates: EmailTemplate[] }>('/api/admin/email-templates', {
      method: 'PUT',
      body: JSON.stringify(template),
    })
    templates.value = body.templates
    successMessage.value = 'Email template saved.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to save template.'
  } finally {
    busy.value = false
  }
}

async function changeView(view: Exclude<AdminView, 'detail'>) {
  activeView.value = view
  if (view === 'dashboard') await loadDashboard()
  if (view === 'orders') await loadOrders()
  if (view === 'templates') await loadTemplates()
}

async function login() {
  busy.value = true
  clearNotices()
  try {
    const body = await apiRequest<{ authenticated: boolean }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (!body.authenticated) throw new Error('Invalid username or password.')
    credentials.password = ''
    authenticated.value = true
    await loadDashboard()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Invalid username or password.'
  } finally {
    busy.value = false
  }
}

async function logout() {
  try {
    await apiRequest('/api/admin/logout', { method: 'POST' })
  } catch {
    // The local session is cleared even if the server request is interrupted.
  }
  authenticated.value = false
  selectedOrder.value = null
  metrics.value = null
}

onMounted(async () => {
  try {
    const body = await apiRequest<{ authenticated: boolean }>('/api/admin/session')
    if (!body.authenticated) throw new Error('Authentication required.')
    authenticated.value = true
    await loadDashboard()
  } catch {
    authenticated.value = false
  } finally {
    authLoading.value = false
  }
})
</script>

<template>
  <main v-if="authLoading" class="admin-loading">Loading secure administration...</main>

  <main v-else-if="!authenticated" class="admin-login-page">
    <section class="admin-login-panel">
      <a class="brand-mark admin-brand" href="https://www.xtruckohw808.com/">
        <span class="brand-mark__symbol">X</span><span>Xtruck</span>
      </a>
      <p class="eyebrow">Secure Administration</p>
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <label for="admin-username">Username</label>
        <input
          id="admin-username"
          v-model.trim="credentials.username"
          autocomplete="username"
          required
        />
        <label for="admin-password">Password</label>
        <input
          id="admin-password"
          v-model="credentials.password"
          type="password"
          autocomplete="current-password"
          required
        />
        <button class="button button--primary" type="submit" :disabled="busy">
          {{ busy ? 'Signing In...' : 'Sign In' }}
        </button>
        <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">
          {{ errorMessage }}
        </p>
      </form>
    </section>
  </main>

  <div v-else class="admin-app">
    <aside class="admin-sidebar">
      <a class="brand-mark admin-brand" href="https://www.xtruckohw808.com/">
        <span class="brand-mark__symbol">X</span><span>Xtruck</span>
      </a>
      <nav aria-label="Administration">
        <button
          v-for="view in views"
          :key="view.key"
          type="button"
          :class="{ active: activeView === view.key }"
          @click="changeView(view.key)"
        >
          {{ view.label }}
        </button>
      </nav>
      <button class="admin-logout" type="button" @click="logout">Logout</button>
    </aside>

    <main class="admin-main">
      <header class="admin-page-heading">
        <div>
          <p class="eyebrow">Xtruck Administration</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <button
          v-if="activeView === 'detail'"
          class="button button--secondary"
          type="button"
          @click="changeView('orders')"
        >
          Back to Orders
        </button>
      </header>

      <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="admin-alert admin-alert--success" role="status">
        {{ successMessage }}
      </p>

      <section v-if="activeView === 'dashboard' && metrics" class="admin-metrics">
        <article>
          <span>Total Orders</span><strong>{{ metrics.totalOrders }}</strong>
        </article>
        <article>
          <span>Paid Orders</span><strong>{{ metrics.paidOrders }}</strong>
        </article>
        <article>
          <span>Pending Fulfillment</span><strong>{{ metrics.pendingFulfillment }}</strong>
        </article>
        <article>
          <span>Shipped Orders</span><strong>{{ metrics.shippedOrders }}</strong>
        </article>
        <article>
          <span>Total Revenue</span><strong>{{ formatMoney(metrics.totalRevenue) }}</strong>
        </article>
      </section>

      <section v-else-if="activeView === 'orders'" class="admin-orders-panel">
        <form class="admin-filters" @submit.prevent="loadOrders">
          <input v-model.trim="filters.search" placeholder="Order number or customer email" />
          <select v-model="filters.paymentStatus" aria-label="Payment status">
            <option value="">All payment statuses</option>
            <option
              v-for="status in [
                'pending',
                'approved',
                'paid',
                'failed',
                'cancelled',
                'refunded',
                'review',
              ]"
              :key="status"
              :value="status"
            >
              {{ formatStatus(status) }}
            </option>
          </select>
          <select v-model="filters.fulfillmentStatus" aria-label="Fulfillment status">
            <option value="">All fulfillment statuses</option>
            <option
              v-for="status in ['unfulfilled', 'processing', 'shipped', 'completed', 'cancelled']"
              :key="status"
              :value="status"
            >
              {{ formatStatus(status) }}
            </option>
          </select>
          <button class="button button--primary" type="submit" :disabled="busy">Filter</button>
        </form>

        <div class="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Country</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orders" :key="item.id">
                <td>
                  <strong>{{ item.order_number }}</strong>
                </td>
                <td>
                  {{ item.customer_name || 'Not provided'
                  }}<small>{{ item.customer_email || 'Not provided' }}</small>
                </td>
                <td>{{ item.shipping_country || '-' }}</td>
                <td>{{ item.product_name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatMoney(item.total_amount, item.currency) }}</td>
                <td>
                  <span class="admin-status">{{ formatStatus(item.payment_status) }}</span>
                </td>
                <td>
                  <span class="admin-status">{{ formatStatus(item.fulfillment_status) }}</span>
                </td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td>
                  <button class="admin-link-button" type="button" @click="openOrder(item.id)">
                    Details
                  </button>
                </td>
              </tr>
              <tr v-if="!orders.length">
                <td colspan="10">No matching orders.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else-if="activeView === 'detail' && selectedOrder" class="admin-detail-grid">
        <article>
          <h2>Customer</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{{ selectedOrder.customer_name || 'Not provided' }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ selectedOrder.customer_email || 'Not provided' }}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{{ selectedOrder.customer_phone || 'Not provided' }}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{{ selectedOrder.shipping_country || 'Not provided' }}</dd>
            </div>
            <div>
              <dt>Shipping Address</dt>
              <dd>{{ formatAddress(selectedOrder.shipping_address) }}</dd>
            </div>
          </dl>
        </article>
        <article>
          <h2>Order</h2>
          <dl>
            <div>
              <dt>Order Number</dt>
              <dd>{{ selectedOrder.order_number }}</dd>
            </div>
            <div>
              <dt>Product</dt>
              <dd>{{ selectedOrder.product_name }}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{{ selectedOrder.product_sku }}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>{{ selectedOrder.quantity }}</dd>
            </div>
            <div>
              <dt>Unit Price</dt>
              <dd>{{ formatMoney(selectedOrder.unit_price, selectedOrder.currency) }}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{{ formatMoney(selectedOrder.subtotal, selectedOrder.currency) }}</dd>
            </div>
            <div>
              <dt>Delivery Cost</dt>
              <dd>{{ formatMoney(selectedOrder.shipping_amount, selectedOrder.currency) }}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{{ formatMoney(selectedOrder.total_amount, selectedOrder.currency) }}</dd>
            </div>
            <div>
              <dt>Created At</dt>
              <dd>{{ formatDate(selectedOrder.created_at) }}</dd>
            </div>
          </dl>
        </article>
        <article>
          <h2>Payment</h2>
          <dl>
            <div>
              <dt>Provider</dt>
              <dd>{{ selectedOrder.payment_provider }}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{{ formatStatus(selectedOrder.payment_status) }}</dd>
            </div>
            <div>
              <dt>PayPal Order ID</dt>
              <dd>{{ selectedOrder.paypal_order_id || '-' }}</dd>
            </div>
            <div>
              <dt>PayPal Capture ID</dt>
              <dd>{{ selectedOrder.paypal_capture_id || '-' }}</dd>
            </div>
            <div>
              <dt>Confirmation Email</dt>
              <dd>{{ formatDate(selectedOrder.confirmation_email_sent_at) }}</dd>
            </div>
          </dl>
        </article>
        <article>
          <h2>Fulfillment</h2>
          <form class="admin-detail-form" @submit.prevent="saveFulfillment">
            <label for="fulfillment-status">Fulfillment Status</label>
            <select id="fulfillment-status" v-model="fulfillmentForm.fulfillmentStatus">
              <option
                v-for="status in ['unfulfilled', 'processing', 'shipped', 'completed', 'cancelled']"
                :key="status"
                :value="status"
              >
                {{ formatStatus(status) }}
              </option>
            </select>
            <label for="shipping-carrier">Shipping Carrier</label>
            <input id="shipping-carrier" v-model.trim="fulfillmentForm.shippingCarrier" />
            <label for="tracking-number">Tracking Number</label>
            <input id="tracking-number" v-model.trim="fulfillmentForm.trackingNumber" />
            <p>Shipping email: {{ formatDate(selectedOrder.shipping_email_sent_at) }}</p>
            <button class="button button--primary" type="submit" :disabled="busy">
              Save Fulfillment
            </button>
          </form>
        </article>
      </section>

      <section v-else-if="activeView === 'templates'" class="admin-templates">
        <div class="template-variables">
          <strong>Available Variables</strong>
          <code v-for="variable in variables" :key="variable">{{ variable }}</code>
        </div>
        <form
          v-for="template in templates"
          :key="template.key"
          @submit.prevent="saveTemplate(template)"
        >
          <h2>{{ formatStatus(template.key) }}</h2>
          <label :for="`${template.key}-subject`">Subject</label>
          <input :id="`${template.key}-subject`" v-model="template.subject" required />
          <label :for="`${template.key}-body`">Body</label>
          <textarea
            :id="`${template.key}-body`"
            v-model="template.body"
            rows="14"
            required
          ></textarea>
          <button class="button button--primary" type="submit" :disabled="busy">
            Save Template
          </button>
        </form>
      </section>
    </main>
  </div>
</template>
