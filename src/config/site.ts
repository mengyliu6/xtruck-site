import type { NavItem } from '@/types/product'

export const siteConfig = {
  brandName: 'Xtruck',
  contactEmail: 'xtruck@qq.com',
  whatsappNumber: '8613360519239',
  whatsappDisplayNumber: '+86 133 6051 9239',
  whatsappDefaultMessage:
    "Hello, I'm interested in the Xtruck OHW808.\n\nEquipment brand:\nEquipment model:\nYear:\nEngine model:\nDiagnostic requirements:\n\nCould you please confirm compatibility and send me more product details?",
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  },
  paymentsEnabled: true,
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  bankTransferEnabled: import.meta.env.VITE_BANK_TRANSFER_ENABLED === 'true',
  canonicalUrl: import.meta.env.VITE_CANONICAL_URL || 'https://www.xtruckohw808.com/',
  socialLinks: [],
  company: {
    name: 'Xtruck',
    tagline: 'Off-Road, Construction, Off-Highway & Agricultural Vehicle Scanner',
  },
}

export const navigationItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'OHW808', href: '/product/ohw808' },
  { label: 'Agent', href: '/agent' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
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
