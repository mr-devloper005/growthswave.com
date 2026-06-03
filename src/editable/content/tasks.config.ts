import type { TaskKey } from '@/lib/site-config'

export const slot4TaskSupport = {
  sbm: true,
  article: false,
  classified: false,
  profile: false,
  pdf: false,
  listing: false,
  image: false,
} satisfies Record<TaskKey, boolean>

export const slot4TaskNotes = {
  article: 'Disabled',
  classified: 'Disabled',
  sbm: 'Social bookmarking pages and detail views',
  profile: 'Disabled',
  pdf: 'Disabled',
  listing: 'Disabled',
  image: 'Disabled',
} satisfies Record<TaskKey, string>
