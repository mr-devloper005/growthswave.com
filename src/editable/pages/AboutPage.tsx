import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1600px] px-4 py-14 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2.4rem] border border-black/[0.08] bg-white p-8 shadow-[0_24px_80px_rgba(75,46,43,0.10)] lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 text-5xl font-black tracking-[-0.08em] sm:text-6xl">About {SITE_CONFIG.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
            <div className="mt-8 space-y-4 text-sm leading-8 text-[var(--slot4-page-text)]/78">
              {pagesContent.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <aside className="grid gap-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className={`rounded-[2rem] border border-black/[0.08] p-6 shadow-[0_18px_44px_rgba(75,46,43,0.08)] ${index % 2 === 0 ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,240,0.96))]' : 'bg-white'}`}>
                <h2 className="text-xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
