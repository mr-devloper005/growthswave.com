import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Social bookmarking with a warm premium finish',
      description: 'A focused bookmarking home for curated links, saved resources, and quick discovery.',
      openGraphTitle: 'Social bookmarking with a warm premium finish',
      openGraphDescription: 'Browse curated bookmarks and saved resources through a polished, collection-first layout.',
      keywords: ['social bookmarking', 'bookmarks', 'curated resources', 'saved links'],
    },
    hero: {
      badge: 'Saved resources',
      title: ['Select, organize,', 'and share useful links.'],
      description:
        'A refined homepage for browsing bookmarks, saved resources, and useful links through a calm premium layout.',
      primaryCta: { label: 'Browse bookmarks', href: '/sbm' },
      secondaryCta: { label: 'Search resources', href: '/search' },
      searchPlaceholder: 'Search titles, tags, categories, or keywords',
      focusLabel: 'Featured collection',
      featureCardBadge: 'bookmark rail',
      featureCardTitle: 'Fresh bookmarks for reading',
      featureCardDescription:
        'The home page balances useful links with quick scanning so visitors can move from featured bookmarks to collections in seconds.',
    },
    intro: {
      badge: 'Why this layout works',
      title: 'A modern bookmark shelf with premium polish.',
      paragraphs: [
        'The site is arranged to highlight saved links first while still making collections easy to reach.',
        'Cards, rails, and blocks are mixed intentionally so bookmarks feel curated instead of repetitive.',
        'The result feels current, spacious, and calm on desktop while still reading cleanly on mobile screens.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Featured hero with strong hierarchy and quick actions.',
        'Multiple card styles to make the archive feel curated.',
        'Clean category handling with safe fallbacks for missing data.',
        
      ],
      primaryLink: { label: 'Open bookmarks', href: '/sbm' },
      secondaryLink: { label: 'Search resources', href: '/search' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Move through your saved links with one polished entry point.',
      description:
        'Browse bookmarks and resource collections without losing the calm premium feel across the site.',
      primaryCta: { label: 'View archive', href: '/sbm' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh bookmarks from this collection are shown here with stronger visual variety.',
    },
  },
  about: {
    badge: 'About Us',
    title: 'A polished space for saved links and curated resources.',
    description: `${slot4BrandConfig.siteName} presents bookmarks in a warm, premium style that makes browsing feel intentional and easy.`,
    paragraphs: [
      'This site keeps saved links easy to scan, easy to revisit, and easy to organize into a calm browsing flow.',
      'The layout uses a refined rhythm so featured bookmarks feel special while the archive remains practical.',
    ],
    values: [
      {
        title: 'Bookmark-first design',
        description: 'Clear spacing, strong typography, and layered cards keep each saved link easy to find.',
      },
      {
        title: 'Curated collections',
        description: 'Collections and saved resources stay focused on useful links instead of filler content.',
      },
      {
        title: 'Calm browsing',
        description: 'Every page renders safely with fallbacks when image, category, or summary data is missing.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Send a note and keep the conversation simple.',
    description:
      'Use this page for general questions, collaboration ideas, or support requests. The layout stays refined and easy to read.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search bookmarks and saved resources with a focused archive layout.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find the right bookmark quickly.',
      description: 'Search titles, tags, and categories with filters that stay easy to use.',
      placeholder: 'Search by keyword, tag, category, or title',
    },
    resultsTitle: 'Latest bookmarks',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit content from a clean publishing workspace.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to open the publishing workspace.',
      description:
        'Create posts, add summary details, and prepare content in a focused workspace once you are logged in.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content with a calm, structured form.',
      description: 'Choose a content type and fill in the details without losing the premium feel of the site.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for the site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Log in to continue creating and managing content.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for the site.',
      badge: 'Site access',
      title: 'Create your account.',
      description: 'Sign up to access the publishing workspace and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reads',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
