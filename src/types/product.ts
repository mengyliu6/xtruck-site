export interface NavItem {
  label: string
  href?: string
  kind?: 'primary' | 'utility'
  children?: NavItem[]
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
  description: string
  icon: IconName
  image?: string
  imageAlt?: string
}

export interface ProductCoverageGroup {
  title: string
  icon: IconName
  brands: string[]
}

export interface ProductWorkflowStep {
  title: string
  description: string
  image?: string
  imageAlt?: string
}

export interface ProductPackageGroup {
  title: string
  items: string[]
}

export interface ProductResource {
  title: string
  description: string
  href?: string
  downloadName?: string
  actionLabel?: string
}

export interface ProductArticle {
  title: string
  description: string
  points: string[]
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

export interface ProductData {
  brand: string
  name: string
  model: string
  priceUsd: number
  summary: string
  shortDescription: string
  coreSellingPoints: string[]
  overview: string[]
  useCases: string[]
  features: ProductFeature[]
  coverageGroups: ProductCoverageGroup[]
  workflow: ProductWorkflowStep[]
  additionalTools: ProductFeature[]
  specs: ProductSpec[]
  languages: string[]
  packageGroups: ProductPackageGroup[]
  resources: ProductResource[]
  articles: ProductArticle[]
  media: ProductMedia[]
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
  | 'expand'
  | 'document'
