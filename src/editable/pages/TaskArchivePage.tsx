import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowRight, Bookmark, BriefcaseBusiness, Camera, Download, Filter, FileText, Image as ImageIcon, Megaphone, Search, UserRound, Sparkles } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { ArticleListCard, CompactIndexCard, EditorialBadgeCard, EditorialFeatureCard, ImageFirstCard, getEditableCategory, getEditablePostImage } from '@/editable/cards/PostCards'
import { cleanDisplayText, getDisplayTitle } from '@/editable/content/display-text'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const taskPageMetadata: Record<TaskKey, { title: string; description: string }> = {
  article: { title: 'Articles', description: 'Browse featured reading and editorial posts.' },
  listing: { title: 'Listings', description: 'Browse business listing posts.' },
  classified: { title: 'Classifieds', description: 'Browse offers and notices.' },
  image: { title: 'Images', description: 'Browse visual posts and gallery items.' },
  sbm: { title: 'Bookmarks', description: 'Browse saved resource posts.' },
  pdf: { title: 'PDFs', description: 'Browse document and file posts.' },
  profile: { title: 'Profiles', description: 'Browse people and profile pages.' },
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).filter(Boolean).slice(0, 8)
}

const getSummary = (post: SitePost) => cleanDisplayText(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; layout: string; promise: string; badge: string }> = {
  article: { icon: FileText, layout: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards, list cards, and feature cards create a more magazine-like archive.', badge: 'Read' },
  listing: { icon: BriefcaseBusiness, layout: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards emphasize location, contacts, and comparison-friendly metadata.', badge: 'Business' },
  classified: { icon: Megaphone, layout: 'grid gap-5 xl:grid-cols-2', promise: 'Offer cards prioritize price, urgency, and quick action paths.', badge: 'Offer' },
  image: { icon: Camera, layout: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery browsing with image-first cards and softer captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, layout: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay text-forward to keep saved resources easy to scan.', badge: 'Bookmark' },
  pdf: { icon: Download, layout: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context and download intent.', badge: 'PDF' },
  profile: { icon: UserRound, layout: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, role, and quick recognition.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  if (task !== 'sbm') notFound()
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': preset.colors.foreground,
    '--archive-surface': preset.colors.surface,
    '--archive-accent': preset.colors.accent,
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const heroPosts = posts.slice(0, 6)
  const gridPosts = posts.slice(6)

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <div className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--archive-surface)] p-7 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">
              <Icon className="h-4 w-4" /> {label}
            </div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">
              {voice?.headline || `Browse ${label}`}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--archive-text)]/72">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-[1.6rem] border border-black/[0.08] bg-white/75 p-4 text-sm font-bold leading-7 text-[var(--archive-text)]/75">
              {deck.promise}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)] transition hover:-translate-y-0.5">
                Browse all
              </Link>
              <Link href="/search" className="rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">
                Search archive
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {(voice?.chips || []).map((chip) => (
                <span key={chip} className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--archive-text)]">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <form action={basePath} className="self-end rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_18px_50px_rgba(75,46,43,0.08)] backdrop-blur">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">
              <Filter className="h-4 w-4" /> Filter
            </div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-black/[0.08] bg-white px-4 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)] transition hover:-translate-y-0.5">
              Apply
            </button>
            <p className="mt-3 text-xs font-bold text-[var(--archive-text)]/55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-8">
          {task === 'sbm' ? (
            <div className="mt-10">
              {posts.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post, index) => (
                    <BookmarkArchiveCard key={post.id || post.slug} post={post} href={buildTaskHref(basePath, post)} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-black/[0.08] bg-white/70 p-10 text-center shadow-sm">
                  <Search className="mx-auto h-8 w-8 opacity-45" />
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No bookmarks found</h2>
                  <p className="mt-2 text-sm text-[var(--archive-text)]/65">Try another category or refresh after new content is published.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10">
              {heroPosts.length ? (
                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="grid gap-5">
                    <EditorialFeatureCard post={heroPosts[0]} href={buildTaskHref(basePath, heroPosts[0])} />
                    {heroPosts[1] ? <ArticleListCard post={heroPosts[1]} href={buildTaskHref(basePath, heroPosts[1])} index={1} /> : null}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    {heroPosts.slice(2, 4).map((post) => (
                      <ImageFirstCard key={post.id || post.slug} post={post} href={buildTaskHref(basePath, post)} />
                    ))}
                    {heroPosts[4] ? <EditorialBadgeCard post={heroPosts[4]} href={buildTaskHref(basePath, heroPosts[4])} /> : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-10">
                {posts.length ? (
                  <div className={deck.layout}>
                    {gridPosts.map((post, index) => (
                      <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index + 6} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-black/[0.08] bg-white/70 p-10 text-center shadow-sm">
                    <Search className="mx-auto h-8 w-8 opacity-45" />
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
                    <p className="mt-2 text-sm text-[var(--archive-text)]/65">Try another category or refresh after new content is published.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? (
              <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">
                Previous
              </Link>
            ) : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">
              Page {page} of {pagination.totalPages || 1}
            </span>
            {pagination.hasNextPage ? (
              <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">
                Next
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function buildTaskHref(basePath: string, post: SitePost) {
  return `${basePath}/${post.slug}`
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = buildTaskHref(basePath, post)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--archive-text)]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--archive-text)]/65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)] sm:grid-cols-[124px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-black/[0.08]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--archive-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-bg)]">Directory</span>
          {location ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]">
              <Sparkles className="h-3 w-3" /> {location}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--archive-text)]/65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[var(--archive-text)]/70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className="grid min-h-64 sm:grid-cols-[0.74fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.08em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-85" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--archive-text)]/65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">
            View listing <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]">
          <ImageIcon className="h-3 w-3" /> Visual
        </div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--archive-accent)]">Bookmark {String(index + 1).padStart(2, '0')}</p>
      <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--archive-text)]/68">{getSummary(post)}</p>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getEditableCategory(post)
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <FileText className="h-8 w-8" />
        </div>
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--archive-text)]/65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">
        Open document <Download className="h-4 w-4" />
      </p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/[0.08] bg-white p-6 text-center shadow-[0_18px_48px_rgba(75,46,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(75,46,43,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-black/[0.08]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--archive-text)]">{getDisplayTitle(post)}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--archive-text)]/65">{getSummary(post)}</p>
    </Link>
  )
}




