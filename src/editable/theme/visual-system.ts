import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'quiet luxury and editorial calm',
    fontDirection: 'balanced serif headline energy with soft sans body',
    colors: {
      background: '#fff8f0',
      foreground: '#4b2e2b',
      muted: '#8c5a3c',
      primary: '#4b2e2b',
      accent: '#c08552',
      surface: '#fffdf9',
    },
    shape: 'rounded modules, soft borders, layered whitespace',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, warm, polished',
    fontDirection: 'high-contrast display moments with spacious tracking',
    colors: {
      background: '#4b2e2b',
      foreground: '#fff8f0',
      muted: '#efdac8',
      primary: '#fff8f0',
      accent: '#c08552',
      surface: '#2c1917',
    },
    shape: 'dark velvet panels, gold accents, generous negative space',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'bold, raw, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: {
      background: '#f3ede4',
      foreground: '#221916',
      muted: '#69584f',
      primary: '#221916',
      accent: '#c08552',
      surface: '#fffdf9',
    },
    shape: 'hard edges, thick borders, offset blocks',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'warm, natural, trustworthy',
    fontDirection: 'humanist sans with softer editorial pacing',
    colors: {
      background: '#fff6ea',
      foreground: '#4b2e2b',
      muted: '#8c5a3c',
      primary: '#4b2e2b',
      accent: '#c08552',
      surface: '#fffdf8',
    },
    shape: 'rounded cards, natural spacing, quiet texture',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp data accents',
    colors: {
      background: '#fff8f0',
      foreground: '#4b2e2b',
      muted: '#8c5a3c',
      primary: '#4b2e2b',
      accent: '#c08552',
      surface: '#ffffff',
    },
    shape: 'clean grids, pill filters, clear information hierarchy',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful, local, energetic',
    fontDirection: 'chunky headings with friendly body type',
    colors: {
      background: '#fff2df',
      foreground: '#3d241f',
      muted: '#7d5140',
      primary: '#3d241f',
      accent: '#c08552',
      surface: '#fffaf5',
    },
    shape: 'stickers, tabs, framed modules, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: {
      background: '#120d0c',
      foreground: '#fff8f0',
      muted: '#d8c6b7',
      primary: '#fff8f0',
      accent: '#c08552',
      surface: '#1d1513',
    },
    shape: 'dark cards, large media, glass overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset:
    slot4BrandConfig.productKind === 'visual'
      ? 'visual-gallery'
      : slot4BrandConfig.productKind === 'editorial'
        ? 'editorial-paper'
        : slot4BrandConfig.productKind === 'directory'
          ? 'tech-directory'
          : 'organic-journal',
  radius: {
    sm: '0.75rem',
    md: '1.25rem',
    lg: '2rem',
    xl: '2.75rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-xl',
    softHover: 'transition duration-300 hover:opacity-85',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-5xl font-black tracking-[-0.08em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl',
    body: 'text-base leading-8',
    caption: 'text-xs font-semibold uppercase tracking-[0.2em]',
  },
  surfaces: {
    glass: 'border border-white/12 bg-white/8 backdrop-blur-xl',
    paper: 'border border-black/8 bg-white shadow-[0_24px_70px_rgba(75,46,43,0.10)]',
    quiet: 'border border-black/8 bg-black/[0.03]',
    dark: 'border border-white/10 bg-black/30 shadow-[0_24px_70px_rgba(0,0,0,0.24)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px]',
    sectionY: 'py-12 sm:py-16 lg:py-20',
    cardGrid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
