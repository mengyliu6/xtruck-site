import type { NavItem } from '@/types/product'

export const siteConfig = {
  brandName: 'Xtruck',
  contactEmail: '',
  whatsappNumber: '8613684920569',
  whatsappDefaultMessage:
    "Hello, I'm interested in the Xtruck OHW808. Could you please send me more product details and confirm compatibility?",
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  },
  paymentsEnabled: false,
  canonicalUrl: 'https://example.com/',
  socialLinks: [],
  company: {
    name: 'Xtruck',
    tagline: 'Professional Diagnostic Solutions for Heavy-Duty & Off-Highway Equipment',
  },
}

export const navigationItems: NavItem[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Downloads', href: '#downloads' },
  { label: 'Features', href: '#features' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'Videos', href: '#videos' },
  { label: 'FAQ', href: '#faq' },
]

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(siteConfig.currency.locale, {
    style: 'currency',
    currency: siteConfig.currency.code,
    maximumFractionDigits: 0,
  }).format(value)
}

export function getWhatsAppUrl(pageUrl = ''): string {
  const suffix = pageUrl ? ` Page: ${pageUrl}` : ''
  const text = encodeURIComponent(`${siteConfig.whatsappDefaultMessage}${suffix}`)
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
}
