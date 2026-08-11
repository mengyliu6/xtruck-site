export interface NavItem {
  label: string
  href: string
}

export interface ProductMedia {
  type: 'image' | 'video'
  label: string
  src: string
  poster?: string
  alt?: string
}

export interface ProductFeature {
  title: string
  summary: string
  detail: string
  icon: IconName
}

export interface ProductDownload {
  name: string
  type: string
  size?: string
  version?: string
  updated?: string
  href?: string
  status: 'available' | 'coming-soon'
}

export interface ProductFaq {
  category: string
  question: string
  answer: string
}

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductUpdateLog {
  brand: string
  version: string
}

export interface ProductData {
  brand: string
  name: string
  model: string
  priceUsd: number
  summary: string
  shortDescription: string
  coreSellingPoints: string[]
  quickFunctions: string[]
  overview: string[]
  useCases: string[]
  diagnosticCoverage: string[]
  supportBrands: string[]
  updateLog: ProductUpdateLog[]
  detailOutline: string[]
  features: ProductFeature[]
  specs: ProductSpec[]
  packageContents: string[]
  media: ProductMedia[]
  downloads: ProductDownload[]
  faqs: ProductFaq[]
}

export type IconName =
  | 'machine'
  | 'tractor'
  | 'engine'
  | 'obd'
  | 'toolbox'
  | 'remote'
  | 'update'
  | 'database'
  | 'shield'
  | 'screen'
  | 'message'
  | 'download'
  | 'document'
