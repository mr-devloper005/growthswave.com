import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Long-form articles with an editorial rhythm.',
    description: 'A spacious layout for essays, stories, guides, and evergreen reading.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Highlights, lists, and feature cards keep the archive lively.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving classifieds and quick offers.',
    description: 'Practical cards with stronger pricing, urgency, and action cues.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Keep the scan length short and the decisions obvious.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Bookmark collections arranged for quick recall.',
    description: 'A resource shelf feel with calm metadata and useful links.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Use text-forward cards when the destination matters more than decoration.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Identity-first cards with trust cues.',
    description: 'Profiles should feel discoverable, personal, and easy to compare.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Keep the name, role, and call-to-action close together.',
    chips: ['Identity first', 'Trust cues', 'Creator/business cards'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'PDFs and guides in a usable library layout.',
    description: 'Files feel more helpful when the preview, summary, and download action are obvious.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues and clear file metadata.',
    chips: ['Documents', 'Guides', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings with comparison-friendly details.',
    description: 'Make business pages feel organized, credible, and easy to scan.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Prioritize location, contacts, and straightforward action paths.',
    chips: ['Directory', 'Compare', 'Business discovery'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Images with a gallery-first browsing rhythm.',
    description: 'Lead with visual impact while keeping the supporting copy lightweight.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the image carry the first impression.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>

