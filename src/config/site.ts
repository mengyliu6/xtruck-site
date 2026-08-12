import type { NavItem } from '@/types/product'

export const siteConfig = {
  brandName: 'Xtruck',
  contactEmail: '',
  whatsappNumber: '8613684920569',
  whatsappDisplayNumber: '+86 136 8492 0569',
  whatsappDefaultMessage:
    "Hello, I'm interested in the Xtruck OHW808.\n\nEquipment brand:\nEquipment model:\nYear:\nEngine model:\nDiagnostic requirements:\n\nCould you please confirm compatibility and send me more product details?",
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  },
  paymentsEnabled: false,
  canonicalUrl: 'https://xtruck-site.vercel.app/',
  socialLinks: [],
  company: {
    name: 'Xtruck',
    tagline: 'Off-Road, Construction, Off-Highway & Agricultural Vehicle Scanner',
  },
}

export const navigationItems: NavItem[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Features', href: '#features' },
  { label: 'Coverage', href: '#coverage' },
  { label: 'Specifications', href: '#specifications' },
  { label: 'Package', href: '#package' },
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
  const suffix = pageUrl ? `\n\nPage: ${pageUrl}` : ''
  const text = encodeURIComponent(`${siteConfig.whatsappDefaultMessage}${suffix}`)
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
}
