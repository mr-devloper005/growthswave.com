'use client'

import { Mail, MessageSquare, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const lanes = [
    { icon: MessageSquare, title: 'General questions', body: 'Reach out for broad site questions or ideas.' },
    { icon: Mail, title: 'Collaboration notes', body: 'Share a brief if you want to talk through a new page or section.' },
    { icon: Phone, title: 'Direct support', body: 'Use the form below for a practical message and a quick response path.' },
    { icon: MapPin, title: 'Planning a launch', body: 'If you are preparing content, a directory, or a resource page, keep it concise and specific.' },
  ]

  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--slot4-muted-text)] sm:text-base">{pagesContent.contact.description}</p>
            <div className="mt-8 grid gap-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_18px_44px_rgba(75,46,43,0.08)]">
                  <lane.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-black/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,240,0.96))] p-6 shadow-[0_24px_80px_rgba(75,46,43,0.10)] sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
              <Sparkles className="h-4 w-4" /> {pagesContent.contact.formTitle}
            </div>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

