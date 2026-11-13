import { Children, isValidElement } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { ListScope } from './box'
import { TableScope } from './table'

/*
 * Blocks for the legacy guide layout used by Civil Registration, PDRRMD and the Provincial
 * Health Office (`.lcr-layout`): quick facts, topic buttons, topic sections with a coloured
 * header, and a contact sidebar.
 */

// Formatted MDX puts single-line text on its own line, which makes it a paragraph; these
// blocks show that text inline, as legacy does.
const inlineParagraphs = '[&_p]:m-0 [&_p]:inline'

/** Legacy `.section`: a page band with 64px padding (32px from 1024px, 24px on phones). */
export function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="section-y">
      <div className="container-site">{children}</div>
    </section>
  )
}

/**
 * Legacy `.quick-stats`: four facts, two per row up to 768px. Plain `1fr` columns (not
 * Tailwind's `minmax(0, 1fr)`) so a column widens for a long word, as in legacy.
 */
export function KeyFacts({ children }: { children: React.ReactNode }) {
  return (
    <dl className="mb-8 grid grid-cols-[repeat(4,1fr)] gap-6 max-[769px]:grid-cols-[repeat(2,1fr)]">
      {children}
    </dl>
  )
}

export function KeyFact({
  icon,
  label,
  children,
}: {
  icon: IconName
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[10px] border border-line bg-white p-6 text-center">
      <Icon name={icon} className="text-[2rem] text-primary" />
      <dt className="mb-1 text-[0.75rem] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-ink-light">
        {label}
      </dt>
      <dd className="m-0 text-[1.125rem] font-semibold text-ink [&_p]:m-0">{children}</dd>
    </div>
  )
}

/** Legacy `.lcr-nav`: buttons that jump to the topics on the page. */
export function TopicNav({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav
      aria-label={label}
      className="mb-8 flex flex-wrap justify-center gap-2 rounded-xl bg-white p-6 shadow-sm"
    >
      {children}
    </nav>
  )
}

export function TopicLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: IconName
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-site border border-line bg-surface-alt px-4 py-2.5 text-[0.875rem] font-medium text-ink no-underline transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:no-underline',
        inlineParagraphs,
      )}
    >
      <Icon name={icon} />
      <span>{children}</span>
    </a>
  )
}

/** Legacy `.lcr-layout`: topics on the left and a 300px contact card, stacked below 992px. */
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_300px] items-start gap-12 max-[992px]:grid-cols-1">
      {children}
    </div>
  )
}

export function Topics({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

const themes = {
  primary: 'from-primary to-secondary',
  birth: 'from-[#3b82f6] to-[#2563eb]',
  marriage: 'from-[#ec4899] to-[#db2777]',
  death: 'from-[#6b7280] to-[#4b5563]',
  cenomar: 'from-[#8b5cf6] to-[#7c3aed]',
  correction: 'from-[#f59e0b] to-[#d97706]',
  legitimation: 'from-[#10b981] to-[#059669]',
  foundling: 'from-[#06b6d4] to-[#0891b2]',
  delayed: 'from-[#ef4444] to-[#dc2626]',
} as const

/**
 * Legacy `.service-section`: a coloured header card (`theme` picks the legacy colour) and a
 * white card for the topic's text. `id` is the target of a `<TopicLink href="#id">`.
 */
export function Topic({
  id,
  theme = 'primary',
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string
  theme?: keyof typeof themes
  icon: IconName
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="mb-12 scroll-mt-30">
      <div
        className={cn(
          'mb-6 flex items-center gap-6 rounded-xl bg-linear-135 px-8 py-6 text-white',
          themes[theme],
        )}
      >
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[1.5rem]">
          <Icon name={icon} />
        </div>
        <div>
          <h2 className="m-0 mb-1 text-[1.375rem] text-white">{title}</h2>
          {subtitle && <p className="m-0 text-[0.875rem] text-white/90">{subtitle}</p>}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {/* Legacy gives a heading 20px and a paragraph 14px above them after a checklist. */}
        <div className="p-8 [&_.checklist+h4]:mt-5 [&_.checklist+p]:mt-3.5">
          <TableScope value="light">{children}</TableScope>
        </div>
      </div>
    </div>
  )
}

/** Legacy `.requirements-grid`: a Markdown bullet list shown as tiles with a green check. */
export function Checklist({ children }: { children: React.ReactNode }) {
  return (
    <ListScope value={{ icon: 'check-circle-fill', variant: 'checklist' }}>{children}</ListScope>
  )
}

/** Legacy `.process-steps`: numbered steps, each `<Step title>` with its text inside. */
export function Steps({ children }: { children: React.ReactNode }) {
  let number = 0
  return (
    <div className="my-6 flex flex-col gap-6">
      {Children.map(children, (child) =>
        isValidElement<{ number?: number }>(child) ? (
          <StepNumber number={++number}>{child}</StepNumber>
        ) : null,
      )}
    </div>
  )
}

function StepNumber({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="group flex items-start gap-6">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-135 from-primary to-secondary text-[0.875rem] font-bold text-white">
        {number}
      </div>
      {children}
    </div>
  )
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 border-b border-[#f3f4f6] pb-6 group-last:border-b-0 group-last:pb-0">
      <h4 className="m-0 mb-1 text-[1rem] text-ink">{title}</h4>
      <div className="text-[0.875rem] leading-[1.5] text-ink-light [&_p]:m-0">{children}</div>
    </div>
  )
}

/** Legacy `.contact-sidebar`: the office's contact details, kept in view while scrolling. */
export function ContactCard({
  title,
  icon = 'building',
  children,
}: {
  title: string
  icon?: IconName
  children: React.ReactNode
}) {
  return (
    <aside className="sticky top-25 rounded-xl border border-line bg-white p-8">
      <h3 className="m-0 mb-6 flex items-center gap-2 text-[1.125rem]">
        <Icon name={icon} className="text-primary" />
        <span>{title}</span>
      </h3>
      {children}
    </aside>
  )
}

/** Legacy `.contact-item`: a label with text or links (links are grey, as in legacy). */
export function Contact({
  icon,
  label,
  children,
}: {
  icon: IconName
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#f3f4f6] py-3 last:border-b-0">
      <Icon name={icon} className="mt-0.5 text-[1.125rem] text-primary" />
      <div className="flex-1">
        <strong className="mb-0.5 block text-[0.875rem] text-ink">{label}</strong>
        <span
          className={cn('text-[0.8125rem] text-ink-light [&_a]:text-ink-light', inlineParagraphs)}
        >
          {children}
        </span>
      </div>
    </div>
  )
}

/** Legacy `.related-services`: a Markdown list of links under the contact details. */
export function RelatedLinks({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-t border-line pt-6">
      <h4 className="mb-4 flex items-center gap-2 text-[0.9375rem]">
        <Icon name="link-45deg" className="text-primary" />
        <span>{title}</span>
      </h4>
      <ListScope value={{ icon: 'link-45deg', variant: 'links' }}>{children}</ListScope>
    </div>
  )
}
