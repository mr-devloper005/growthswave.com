import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': '#4b2e2b',
    '--editable-footer-text': '#fff8f0',
    '--editable-footer-border': 'rgba(255,248,240,0.12)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()

  return (
    <footer style={footerVars} className="border-t border-[var(--editable-footer-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.4rem] border border-[var(--editable-footer-border)] bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:p-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.1rem] border border-[var(--editable-footer-border)] bg-white/10">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
              </span>
              <span className="text-lg font-black tracking-[-0.04em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">{globalContent.footer.description}</p>
            
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/55">Browse</h3>
            <div className="mt-4 grid gap-2">
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/55">Site</h3>
            <div className="mt-4 grid gap-2">
              {[
                ['About Us', '/about'],
                ['Contact Us', '/contact'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-bold text-white/80 transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>{globalContent.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
