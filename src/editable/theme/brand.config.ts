import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: 'Curated content with a luxury editorial finish',
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents:
    productKind === 'visual'
      ? { primary: '#fff8f0', surface: '#120d0c' }
      : productKind === 'editorial'
        ? { primary: '#4b2e2b', surface: '#fff8f0' }
        : productKind === 'directory'
          ? { primary: '#4b2e2b', surface: '#fffdf9' }
          : { primary: '#4b2e2b', surface: '#fff8f0' },
} as const

