import type { ProductCoverageGroup } from '@/types/product'

export type CoverageCategory =
  | 'all'
  | 'international-construction'
  | 'agriculture'
  | 'chinese-construction'
  | 'engines'
  | 'hd-obd'

export interface CoverageBrand {
  category: Exclude<CoverageCategory, 'all'>
  categoryLabel: string
  detailsHref?: string
  downloadHref?: string
  downloadName?: string
  name: string
}

export const coverageFilters: Array<{ label: string; value: CoverageCategory }> = [
  { label: 'All brands', value: 'all' },
  { label: 'Construction', value: 'international-construction' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'China brands', value: 'chinese-construction' },
  { label: 'Engines', value: 'engines' },
  { label: 'HD OBD', value: 'hd-obd' },
]

const categoryByTitle: Record<string, { label: string; value: Exclude<CoverageCategory, 'all'> }> =
  {
    'International Construction Machinery': {
      label: 'Construction',
      value: 'international-construction',
    },
    'International Agricultural Machinery': { label: 'Agriculture', value: 'agriculture' },
    'Chinese Construction Machinery': {
      label: 'China construction',
      value: 'chinese-construction',
    },
    'Engine Diagnostics': { label: 'Engine diagnostics', value: 'engines' },
    'HD OBD': { label: 'HD OBD', value: 'hd-obd' },
  }

// Add filenames here as new brand support-list PDFs are placed in public/downloads.
const supportListFiles: Record<string, string> = {
  Bobcat: 'OHW808 Function for Bobcat.pdf',
  CASE: 'OHW808 Function for Case.pdf',
  Caterpillar: 'OHW808 Function for Caterpillar .pdf',
  'Caterpillar Pro': 'OHW808 Function for Caterpillar  Pro.pdf',
  CLAAS: 'OHW808 Function for CLAAS.pdf',
  Cummins: 'OHW808 Function for CUMMINS.pdf',
  DAF: 'OHW808 Function for DAF.pdf',
  Daewoo: 'OHW808 Function for DAEWOO.pdf',
  Deutz: 'OHW808 Function for DEUTZ.pdf',
  Doosan: 'OHW808 Function for DOOSAN.pdf',
  Fendt: 'OHW808 Function for FENDT.pdf',
  'Hitachi Machinery': 'OHW808 Function for HITACHI MACHINERY.pdf',
  Hyundai: 'OHW808 Function for HYUNDAI.pdf',
  Isuzu: 'OHW808 Function for ISUZU .pdf',
  'Isuzu CM': 'OHW808 Function for ISUZU .pdf',
  JCB: 'OHW808 Function for JCB.pdf',
  'John Deere': 'OHW808 Function for JOHN DEERE.pdf',
  Kato: 'OHW808 Function for KATO.pdf',
  'Kobelco Machinery': 'OHW808 Function for KOBELCO MACHINERY.pdf',
  Komatsu: 'OHW808 Function for KOMATSU.pdf',
  Kubota: 'OHW808 Function for KUBOTA.pdf',
  'Massey Ferguson': 'OHW808 Function for MASSEY FERGUSON.pdf',
  'New Holland': 'OHW808 Function for NEW HOLLAND (1).pdf',
  Perkins: 'OHW808 Function for PERKINS.pdf',
  Sumitomo: 'OHW808 Function for SUMITOMO.pdf',
  'Volvo Construction Machinery': 'OHW808 Function for VOLVO.pdf',
  'Volvo Penta': 'OHW808 Function for VOLVO PENTA.pdf',
  Yanmar: 'OHW808 Function for YANMAR.pdf',
  'Zhenyu Machinery': 'OHW808 Function for ZHENYU.pdf',
}

const popularityOrder = [
  'Volvo Construction Machinery',
  'Caterpillar',
  'Caterpillar Pro',
  'John Deere',
  'Komatsu',
  'JCB',
  'Bobcat',
  'Kubota',
  'Hitachi Machinery',
  'CASE',
  'New Holland',
  'Cummins',
  'SANY Heavy Industry',
  'XCMG',
  'Doosan',
  'Hyundai',
  'Deutz',
  'Perkins',
  'CLAAS',
  'Fendt',
  'Massey Ferguson',
  'Yanmar',
  'Kobelco Machinery',
  'Sumitomo',
  'LiuGong Machinery',
  'Zoomlion Heavy Industry',
  'Shandong Shantui',
  'Volvo Penta',
  'Isuzu',
  'DAF',
  'Daewoo',
  'Kato',
  'Foton Lovol',
  'Yuchai Machinery',
  'Longgong Machinery',
  'XGMA',
  'YTO Machinery',
  'Isuzu CM',
  'Zhenyu',
  'Zoomlion Machinery',
  'Shangong Machinery',
  'Shanhe Intelligence',
  'Yutong Machinery',
  'Lishide Machinery',
  'Jonyang Machinery',
  'Pengpu Machinery',
  'Taishan Machinery',
  'Yellow River Machinery',
  'Chengdu Shinkansen',
  'Daxin Machinery',
  'Fuwa Machinery',
  'Fuzhou Sanyuan',
  'Hengt Machinery',
  'Himore Machinery',
  'Shuntong Machinery',
  'Xinyuan Heavy Industry',
  'Zhenyu Machinery',
  'Zhongyou Machinery',
  'Heavy-duty OBD diagnostics',
]

const popularityRank = new Map(popularityOrder.map((brand, index) => [brand, index]))

export function buildCoverageDirectory(groups: ProductCoverageGroup[]): CoverageBrand[] {
  const brands = new Map<string, CoverageBrand>()

  for (const group of groups) {
    const category = categoryByTitle[group.title]
    if (!category) continue

    for (const name of group.brands) {
      const filename = supportListFiles[name]
      brands.set(name.toLocaleLowerCase(), {
        category: category.value,
        categoryLabel: category.label,
        detailsHref: name === 'Volvo Construction Machinery' ? '/brand/volvo' : undefined,
        downloadHref: filename ? `/downloads/${encodeURIComponent(filename)}` : undefined,
        downloadName: filename,
        name,
      })
    }
  }

  return [...brands.values()].sort((left, right) => {
    const leftRank = popularityRank.get(left.name) ?? Number.MAX_SAFE_INTEGER
    const rightRank = popularityRank.get(right.name) ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank || left.name.localeCompare(right.name)
  })
}
