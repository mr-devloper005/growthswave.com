import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { cleanDisplayText, getDisplayTitle, truncateDisplayText } from '@/editable/content/display-text'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  return truncateDisplayText(raw, limit)
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return cleanDisplayText((typeof content.category === 'string' && content.category) || post?.tags?.[0]) || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[540px] p-6 sm:p-8 lg:min-h-[680px]">
        <img src={getEditablePostImage(post)} alt={getDisplayTitle(post)} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,46,43,0.12),rgba(75,46,43,0.9))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[580px]">
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{getDisplayTitle(post)}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">
            Open feature <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block w-[240px] shrink-0 ${dc.motion.lift}`}>
      <article className="overflow-hidden rounded-[1.8rem] border border-black/[0.08] bg-white p-2 shadow-[0_16px_40px_rgba(75,46,43,0.08)]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={getDisplayTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(75,46,43,0.84))] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/78">{getEditableCategory(post)}</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-white">{getDisplayTitle(post)}</h3>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.6rem] border border-black/[0.08] bg-white p-5 shadow-[0_14px_36px_rgba(75,46,43,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(75,46,43,0.14)]`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-xs font-black text-white">
          {index + 1}
        </span>
        <div className="min-w-0">
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{getDisplayTitle(post)}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white p-4 shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)] sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/11] sm:aspect-auto sm:min-h-[220px]`}>
        <img src={getEditablePostImage(post)} alt={getDisplayTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          Read {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Editorial lane</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-3xl">{getDisplayTitle(post)}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-dark-bg)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_44px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={getDisplayTitle(post)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(75,46,43,0.6))]" />
      </div>
      <div className="p-5">
        <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{getDisplayTitle(post)}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

export function EditorialBadgeCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-black/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,248,240,0.96))] p-6 shadow-[0_16px_42px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(75,46,43,0.14)]">
      <div className="flex items-center justify-between gap-3">
      </div>
      <h3 className="mt-6 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{getDisplayTitle(post)}</h3>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 120)}</p>
    </Link>
  )
}
