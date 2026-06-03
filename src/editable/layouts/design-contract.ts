import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#fff8f0',
  '--slot4-page-text': '#4b2e2b',
  '--slot4-panel-bg': '#fff1e4',
  '--slot4-surface-bg': '#fffdf9',
  '--slot4-muted-text': '#8c5a3c',
  '--slot4-soft-muted-text': '#a16c4c',
  '--slot4-accent': '#c08552',
  '--slot4-accent-fill': '#c08552',
  '--slot4-accent-soft': '#f5dfcd',
  '--slot4-dark-bg': '#4b2e2b',
  '--slot4-dark-text': '#fff8f0',
  '--slot4-media-bg': '#f1e1d4',
  '--slot4-cream': '#fff8f0',
  '--slot4-warm': '#fff3e6',
  '--slot4-lavender': '#ead4c4',
  '--slot4-gray': '#f8f1ea',
  '--slot4-body-gradient':
    'radial-gradient(circle at top left, rgba(192,133,82,0.16), transparent 34%), radial-gradient(circle at right 20% top 8%, rgba(75,46,43,0.12), transparent 28%), linear-gradient(180deg, #fff8f0 0%, #fffdf9 38%, #fff2e3 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border border-black/[0.08]',
  darkBorder: 'border border-white/10',
  shadow: 'shadow-[0_18px_60px_rgba(75,46,43,0.10)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(75,46,43,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(75,46,43,0.02),rgba(75,46,43,0.62))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[235px] shrink-0 snap-start sm:w-[260px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-7xl',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full ${editablePalette.darkBg} px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:opacity-95`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-6 py-3 text-sm font-black ${editablePalette.surfaceText} transition hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:opacity-95`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(75,46,43,0.16)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Use the luxury warm palette from editableRootStyle across the site.',
  'Keep the homepage magazine-like with a strong hero, rails, and section blocks.',
  'Keep archive pages varied: featured cards, list cards, horizontal cards, and image-first cards.',
  'Keep dynamic post fetching intact; do not replace real content with mock arrays.',
  'Use postHref() for task-aware links so routes continue to work.',
] as const

