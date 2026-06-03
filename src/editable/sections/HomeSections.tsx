import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialBadgeCard,
  EditorialFeatureCard,
  ImageFirstCard,
  RailPostCard,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function SectionHeader({ title, description, href, actionLabel = 'View all' }: { title: string; description?: string; href: string; actionLabel?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className={dc.type.sectionTitle}>{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)] sm:text-base">{description}</p> : null}
      </div>
      <Link href={href} className="inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-dark-bg)]">
        {actionLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function Rail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

function SpotlightChip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-bg)]">{children}</span>
}

function BookmarkRailTextCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="block w-[240px] shrink-0 rounded-[1.6rem] border border-black/[0.08] bg-white p-4 shadow-[0_16px_40px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(75,46,43,0.14)]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Bookmark {String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-3 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 92)}</p>
    </Link>
  )
}

function BookmarkGridTextCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="block rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Bookmark {String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-4 line-clamp-3 text-[2rem] font-black leading-[1] tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(post, 180)}</p>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const featured = posts[0]
  const secondary = posts[1]
  const tertiary = posts[2]
  const focusItems = timeSections.flatMap((section) => section.posts).slice(0, 4)

  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] bg-[var(--slot4-cream)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-[340px] w-[340px] rounded-full bg-[rgba(192,133,82,0.18)] blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full bg-[rgba(75,46,43,0.12)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:px-8 lg:py-12">
        <div className="rounded-[2.4rem] border border-black/[0.08] bg-white p-6 shadow-[0_24px_80px_rgba(75,46,43,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <SpotlightChip>{pagesContent.home.hero.badge}</SpotlightChip>
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.home.hero.featureCardBadge}</span>
          </div>
          <h1 className={`${dc.type.heroTitle} mt-5 max-w-2xl`}>{pagesContent.home.hero.title.join(' ')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">{pagesContent.home.hero.description}</p>

          <form action="/search" className="mt-7 flex max-w-2xl rounded-full border border-black/[0.08] bg-[var(--slot4-page-bg)] p-2 shadow-sm">
            <Search className="ml-4 mt-3 h-5 w-5 shrink-0 opacity-55" />
            <input
              name="q"
              placeholder={pagesContent.home.hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold outline-none placeholder:text-current/35 sm:text-base"
            />
            <button className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
              Search
            </button>
          </form>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
              Browse {taskLabel(primaryTask).toLowerCase()} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
              Get in touch
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Refined hierarchy', 'Soft cream surfaces', 'Warm metallic accents'].map((item) => (
              <div key={item} className="rounded-[1.4rem] border border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,240,0.96))] p-4 text-sm font-bold text-[var(--slot4-page-text)] shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {featured ? (
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} />
              <div className="grid gap-4">
                {secondary ? <ImageFirstCard post={secondary} href={postHref(primaryTask, secondary, primaryRoute)} /> : null}
                {tertiary ? <EditorialBadgeCard post={tertiary} href={postHref(primaryTask, tertiary, primaryRoute)} /> : null}
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/[0.08] bg-white p-8 text-sm text-[var(--slot4-muted-text)]">No featured content is available yet.</div>
          )}

          <div className="grid gap-3 rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_18px_50px_rgba(75,46,43,0.08)]">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.home.hero.featureCardBadge}</p>
            <h2 className="text-2xl font-black tracking-[-0.05em]">{pagesContent.home.hero.featureCardTitle}</h2>
            <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.featureCardDescription}</p>
            <div className="flex flex-wrap gap-2">
              {focusItems.slice(0, 3).map((post) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]">
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured bookmarks"
          description="A quick-glance strip for the freshest bookmarks, designed to feel more like a collection shelf than a flat feed."
          href={primaryRoute}
        />
        <Rail className="mt-8">
          {railPosts.map((post, index) =>
            primaryTask === 'sbm' ? (
              <BookmarkRailTextCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ) : (
              <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            )
          )}
        </Rail>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 6)
  if (!featured.length) return null
  return (
    <section className="border-t border-black/[0.06] bg-[linear-gradient(180deg,#fffaf5_0%,#fff4e8_100%)]">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          title={`More ${taskLabel(primaryTask).toLowerCase()}`}
          description="Varied card treatments keep the section feeling designed and editorial."
          href={primaryRoute}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((post, index) =>
            primaryTask === 'sbm' ? (
              <BookmarkGridTextCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ) : index % 3 === 0 ? (
              <EditorialFeatureCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ) : index % 3 === 1 ? (
              <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ) : (
              <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            )
          )}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts)
  const fallbackPosts = posts.slice(6, 14)
  const combined = sectionPosts.length ? sectionPosts : fallbackPosts
  const feature = combined[0] || posts[0]
  const secondary = combined.slice(1, 4)
  const tertiary = combined.slice(4, 8)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeader
            title="Browse by mood"
            description="Search-first controls and grouped blocks make the archive feel easy to navigate."
            href="/search"
            actionLabel="Search all"
          />
          <div className="mt-8 rounded-[2.2rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_50px_rgba(75,46,43,0.08)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {['Refined cards', 'Soft spacing', 'Warm palette', 'Editorial rhythm'].map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-black/[0.06] bg-[var(--slot4-gray)] p-4 text-sm font-bold text-[var(--slot4-page-text)]">
                  {item}
                </div>
              ))}
            </div>
            <form action="/search" className="mt-5 flex rounded-full border border-black/[0.08] bg-[var(--slot4-page-bg)] p-2">
              <Search className="ml-4 mt-3 h-5 w-5 opacity-55" />
              <input
                name="q"
                placeholder="Search the archive"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold outline-none placeholder:text-current/35"
              />
              <button className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Search</button>
            </form>
          </div>
        </div>

        <div className="grid gap-5">
          {feature ? (
            <Link href={postHref(primaryTask, feature, primaryRoute)} className="group relative overflow-hidden rounded-[2.4rem] border border-black/[0.08] bg-[var(--slot4-dark-bg)] text-white shadow-[0_26px_90px_rgba(75,46,43,0.18)] transition duration-300 hover:-translate-y-1">
              <img src={getEditablePostImage(feature)} alt={feature.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(75,46,43,0.05),rgba(75,46,43,0.84))]" />
              <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-7 sm:p-10">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/72">Featured bookmark</p>
                <h3 className="mt-4 max-w-2xl text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{feature.title}</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/78">{getExcerpt(feature, 180)}</p>
              </div>
            </Link>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {secondary.map((post, index) => (
              <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tertiary.map((post, index) => (
              <EditorialBadgeCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="border-t border-black/[0.06] bg-[linear-gradient(180deg,#fff8f0_0%,#fffdf9_100%)] scroll-mt-24">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.4rem] border border-black/[0.08] bg-[var(--slot4-dark-bg)] px-6 py-10 text-white shadow-[0_28px_90px_rgba(75,46,43,0.18)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/72">Start exploring</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.06em] sm:text-4xl">
                Explore useful pages through one elegant archive.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
                Search, browse, and open bookmarks with a visual system that feels polished on every route.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
                Search archive <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
