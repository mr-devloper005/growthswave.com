import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated discovery platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Bookmarks', href: '/sbm' },
      { label: 'Search', href: '/search' },
    ],
    actions: {
      primary: { label: 'Browse archive', href: '/sbm' },
      secondary: { label: 'Search bookmarks', href: '/search' },
    },
  },
  footer: {
    tagline: '',
    description: 'A focused social bookmarking space for curated links and resource-driven browsing.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Bookmarks', href: '/sbm' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'Contact', href: '/contact' },
          { label: 'About', href: '/about' },
        ],
      },
    ],
    bottomNote: 'Built for bookmarking, browsing, and resource sharing.',
  },
  commonLabels: {
    readMore: 'Open',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
