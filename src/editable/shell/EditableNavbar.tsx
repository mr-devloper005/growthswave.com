'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, LogOut, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [
      { label: 'Bookmarks', href: '/sbm' },
      { label: 'Search', href: '/search' },
    ],
    []
  )

  const navVars = {
    '--editable-nav-bg': 'rgba(255,248,240,0.94)',
    '--editable-nav-text': '#4b2e2b',
    '--editable-nav-border': 'rgba(75,46,43,0.10)',
    '--editable-nav-surface': '#fffdf9',
    '--editable-nav-accent': '#c08552',
  } as CSSProperties

  const mainLinks = navItems

  return (
    <header
      style={navVars}
      className="sticky top-0 z-50 border-b border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)]/96 text-[var(--editable-nav-text)] backdrop-blur-xl"
    >
      <nav className="mx-auto flex min-h-[92px] w-full max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.1rem] border border-[var(--editable-nav-border)] bg-white shadow-sm">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black tracking-[-0.03em]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-[var(--editable-nav-border)] bg-white/85 p-1 shadow-sm">
            {mainLinks.slice(0, 5).map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    active ? 'bg-[var(--editable-nav-text)] text-white' : 'hover:bg-black/[0.04]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <form action="/search" className="hidden min-w-0 flex-1 justify-center md:flex lg:hidden">
          <label className="flex w-full max-w-xl items-center rounded-full border border-[var(--editable-nav-border)] bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 opacity-55" />
            <input
              name="q"
              type="search"
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/40"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-nav-border)] bg-white px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-black/[0.03]"
              >
                Create bookmark
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--editable-nav-text)] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full border border-[var(--editable-nav-border)] bg-white px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-black/[0.03]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--editable-nav-text)] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-[var(--editable-nav-border)] bg-white p-2.5 shadow-sm lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-nav-border)] bg-[var(--editable-nav-surface)] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex rounded-2xl border border-[var(--editable-nav-border)] bg-white px-3 py-2">
            <Search className="mt-1 h-4 w-4 opacity-55" />
            <input
              name="q"
              type="search"
              placeholder="Search the archive"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
          </form>
          <div className="grid gap-2 sm:grid-cols-2">
            {[{ label: 'Home', href: '/' }, ...mainLinks].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-sm font-black transition hover:-translate-y-0.5"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-sm font-black transition hover:-translate-y-0.5"
                >
                  Create bookmark
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-2xl bg-[var(--editable-nav-text)] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-[var(--editable-nav-border)] bg-white px-4 py-3 text-sm font-black transition hover:-translate-y-0.5"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[var(--editable-nav-text)] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
