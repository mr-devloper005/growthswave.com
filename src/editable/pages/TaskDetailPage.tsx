import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { EditorialBadgeCard, CompactIndexCard, ArticleListCard } from '@/editable/cards/PostCards'
import { cleanDisplayText, getDisplayTitle } from '@/editable/content/display-text'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  if (task !== 'sbm') notFound()
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = await fetchArticleComments(post.slug, 50)
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => cleanDisplayText(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt))
const categoryOf = (post: SitePost, fallback: string) => cleanDisplayText(asText(getContent(post).category) || post.tags?.[0]) || fallback
const normalizeText = (value: string) => cleanDisplayText(value).toLowerCase()

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': preset.colors.foreground,
    '--detail-surface': preset.colors.surface,
    '--detail-accent': preset.colors.accent,
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="min-h-screen bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-4 py-2 text-sm font-black text-[var(--detail-text)] transition hover:-translate-y-0.5">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const category = categoryOf(post, 'Article')
  return (
    <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="min-w-0 rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-surface)] p-5 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-8 lg:p-12">
        <BackLink task="article" />
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--detail-accent)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white">{category}</span>
          {post.publishedAt ? <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--detail-text)]/55">{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
        </div>
        <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-7xl">{getDisplayTitle(post)}</h1>
        {summaryText(post) ? <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--detail-text)]/72">{summaryText(post)}</p> : null}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {images[0] ? <img src={images[0]} alt="" className="h-full min-h-[260px] w-full rounded-[2rem] object-cover" /> : <FallbackPanel icon={FileText} label="No featured image" />}
          <div className="grid gap-4">
            <InfoStrip title="Task" value={getTaskConfig(task)?.label || task} icon={Tag} />
            <InfoStrip title="Site" value={SITE_CONFIG.name} icon={CheckCircle2} />
            {post.slug ? <InfoStrip title="Slug" value={post.slug} icon={SparkIcon} /> : null}
          </div>
        </div>
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-surface)] p-6 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--detail-bg)] ring-1 ring-black/[0.08]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">Business listing</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-6xl">{getDisplayTitle(post)}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--detail-text)]/72">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || getDisplayTitle(post)} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1600px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <aside className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-text)] p-7 text-[var(--detail-bg)] shadow-[0_24px_80px_rgba(75,46,43,0.18)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-[11px] font-black uppercase tracking-[0.28em] opacity-60">Classified notice</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{getDisplayTitle(post)}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--detail-bg)] px-5 py-3 text-sm font-black text-[var(--detail-text)]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-black">Email</a> : null}
        </div>
      </aside>
      <article className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-surface)] p-6 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-9">
        <ImageStrip images={images.length ? images : ['/placeholder.svg?height=900&width=1200']} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2.4rem] border border-black/[0.08] bg-white p-7 shadow-[0_24px_80px_rgba(75,46,43,0.10)] lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--detail-bg)]">
            <Camera className="h-4 w-4" /> Image story
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{getDisplayTitle(post)}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--detail-text)]/72">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_44px_rgba(75,46,43,0.08)]">
              <img src={image} alt="" className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--detail-text)]/65">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <RelatedPanel task="image" post={post} related={related} />
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const summary = summaryText(post)
  const body = getBody(post)
  const showBody = normalizeText(body) && normalizeText(body) !== normalizeText(summary)
  const category = categoryOf(post, 'Bookmark')
  return (
    <section>
      <div className="relative overflow-hidden border-b border-black/[0.06] bg-[var(--slot4-cream)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-15%] h-[340px] w-[340px] rounded-full bg-[rgba(192,133,82,0.18)] blur-3xl" />
          <div className="absolute right-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-[rgba(75,46,43,0.12)] blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1600px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:px-8 lg:py-12">
          <article className="rounded-[2.4rem] border border-black/[0.08] bg-white p-6 shadow-[0_24px_80px_rgba(75,46,43,0.08)] sm:p-8 lg:p-10">
            <BackLink task="sbm" />
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">{category}</span>
              {post.publishedAt ? <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{getDisplayTitle(post)}</h1>
            {summary ? <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg sm:leading-9">{summary}</p> : null}
          </article>

          <div className="grid content-start gap-6">
            <aside className="flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2.4rem] border border-black/[0.08] bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_26px_90px_rgba(75,46,43,0.18)] sm:p-9">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/65">Saved resource</p>
                <h2 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.06em]">A focused read from the {SITE_CONFIG.name} collection.</h2>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">Type</p>
                  <p className="mt-2 text-sm font-black">{category}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">Collection</p>
                  <p className="mt-2 text-sm font-black">Bookmarks</p>
                </div>
              </div>
            </aside>
            <div className="mx-auto w-full max-w-[300px]">
              <Ads slot="sidebar" showLabel eager className="mx-auto w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-black/[0.06] bg-[linear-gradient(180deg,#fffaf5_0%,#fff4e8_100%)]">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
          <article className="rounded-[2.4rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_50px_rgba(75,46,43,0.08)] sm:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">Resource notes</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">Description</h2>
              </div>
              <span className="hidden rounded-full bg-[var(--slot4-gray)] px-4 py-2 text-xs font-black text-[var(--slot4-muted-text)] sm:inline-flex">Curated bookmark</span>
            </div>
            {showBody ? (
              <div className="article-content mt-7 max-w-none text-base leading-8 text-[var(--slot4-page-text)]/82 sm:text-lg sm:leading-9" dangerouslySetInnerHTML={{ __html: formatPlainText(body) }} />
            ) : (
              <div className="mt-7 rounded-[1.6rem] border border-dashed border-black/[0.08] bg-[var(--slot4-gray)] p-6 text-base leading-8 text-[var(--slot4-muted-text)]">
                No additional description is available for this bookmark yet.
              </div>
            )}
          </article>

          <RelatedPanel task="sbm" post={post} related={related} />
        </div>
      </div>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-surface)] p-6 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-9">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--detail-text)] text-[var(--detail-bg)]">
            <FileText className="h-12 w-12" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">PDF resource</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-6xl">{getDisplayTitle(post)}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[var(--detail-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-black/[0.08] bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-xs font-black text-[var(--detail-bg)]">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={getDisplayTitle(post)} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-[2.4rem] border border-black/[0.08] bg-white p-8 text-center shadow-[0_24px_80px_rgba(75,46,43,0.10)] lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--detail-bg)] ring-1 ring-black/[0.08]">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
        </div>
        <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-[-0.08em]">{getDisplayTitle(post)}</h1>
        {role ? <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--detail-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.4rem] border border-black/[0.08] bg-[var(--detail-surface)] p-7 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[var(--detail-text)]/82`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-black/[0.08] bg-[var(--detail-bg)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--detail-text)]/55">
            <Icon className="h-4 w-4" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--detail-text)]/82">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-black/[0.08]" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_18px_44px_rgba(75,46,43,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black">
        <MapPin className="h-4 w-4" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_18px_44px_rgba(75,46,43,0.08)]">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--detail-text)]/55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--detail-text)] px-4 py-2 text-sm font-black text-[var(--detail-bg)]">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm">
      <span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-black/[0.08] bg-white/80 p-5 backdrop-blur">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--detail-text)]/55">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--detail-text)]/78">
            <p className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}
            </p>
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}
            </p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-black/[0.08] bg-white/80 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--detail-text)]/55">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item, index) => {
              if (index % 3 === 0) return <EditorialBadgeCard key={item.id || item.slug} post={item} href={buildPostUrl(task, item.slug)} />
              if (index % 3 === 1) return <CompactIndexCard key={item.id || item.slug} post={item} href={buildPostUrl(task, item.slug)} index={index} />
              return <ArticleListCard key={item.id || item.slug} post={item} href={buildPostUrl(task, item.slug)} index={index} />
            })}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/[0.08] bg-white/80 p-5">
      <div className="flex items-center gap-2 text-lg font-black">
        <MessageCircle className="h-5 w-5" /> Comments
      </div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-black/[0.08] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--detail-text)]/72">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--detail-text)]/60">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}

function InfoStrip({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="rounded-[1.6rem] border border-black/[0.08] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--detail-text)]/55">
        <Icon className="h-4 w-4" /> {title}
      </div>
      <p className="mt-2 text-sm font-bold text-[var(--detail-text)]/82">{value}</p>
    </div>
  )
}

function FallbackPanel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[2rem] border border-dashed border-black/[0.08] bg-[var(--detail-bg)] text-center">
      <div>
        <Icon className="mx-auto h-14 w-14 opacity-40" />
        <p className="mt-3 text-sm font-bold text-[var(--detail-text)]/60">{label}</p>
      </div>
    </div>
  )
}

function SparkIcon(props: any) {
  return <span {...props}>?</span>
}
