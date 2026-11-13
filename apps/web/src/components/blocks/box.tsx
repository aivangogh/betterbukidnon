import { Children, cloneElement, createContext, isValidElement, useContext } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

const box = 'rounded-site border border-black/6 bg-white p-3.5'

/** Legacy `.info-box.office-prose`: paragraphs of running text in a white box. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${box} [&_a]:font-semibold [&_a]:text-primary [&_p]:mb-2.5 [&_p]:text-[0.8125rem] [&_p]:leading-[1.6] [&_p]:text-ink [&_p:last-child]:mb-0`}
    >
      {children}
    </div>
  )
}

type ListOptions = {
  icon: IconName
  note?: string
  boxed?: boolean
  /** `checklist`: tiles with a green check; `links`: a plain list of links. */
  variant?: 'checklist' | 'links'
}
const ListContext = createContext<ListOptions>({ icon: 'check-circle-fill' })

/** Lets a block change how the Markdown lists inside it look. */
export function ListScope({ value, children }: { value: ListOptions; children: React.ReactNode }) {
  return <ListContext value={value}>{children}</ListContext>
}

/**
 * Legacy `.info-box` with a heading and a `.req-list`. Markdown lists inside get the legacy
 * icons: numbers for ordered lists, `listIcon` for bullet lists. `note` ends a bullet list
 * with an info item, such as "Requirements may vary".
 */
export function Box({
  title,
  icon,
  listIcon = 'check-circle-fill',
  note,
  children,
}: {
  title: string
  icon?: IconName
  listIcon?: IconName
  note?: string
  children: React.ReactNode
}) {
  return (
    <div className={box}>
      <h3 className="mb-2.5 text-[0.8125rem] font-semibold uppercase text-ink">
        {/* Legacy `.info-box i` makes heading icons 2rem. */}
        {icon && <Icon name={icon} className="mr-1.5 text-[2rem] text-primary" />}{' '}
        <span>{title}</span>
      </h3>
      <ListContext value={{ icon: listIcon, note, boxed: true }}>{children}</ListContext>
    </div>
  )
}

const listClass = 'm-0 list-none p-0'

export function BulletList({ children }: { children?: React.ReactNode }) {
  const { note, variant } = useContext(ListContext)
  if (variant === 'checklist')
    return (
      <ul className="checklist mt-6 grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-0">
        {children}
      </ul>
    )
  if (variant === 'links') return <ul className="m-0 list-none p-0 text-[0.8125rem]">{children}</ul>
  return (
    <ul className={listClass}>
      {children}
      {note && <ListItem icon="info-circle">{note}</ListItem>}
    </ul>
  )
}

export function NumberedList({ children }: { children?: React.ReactNode }) {
  let number = 0
  return (
    <ol className={listClass}>
      {Children.map(children, (child) =>
        isValidElement<{ icon?: IconName }>(child)
          ? cloneElement(child, { icon: `${++number}-circle-fill` as IconName })
          : child,
      )}
    </ol>
  )
}

export function ListItem({
  icon,
  bare = false,
  children,
}: {
  icon?: IconName
  /** Put the children in the list item directly instead of in a span. */
  bare?: boolean
  children?: React.ReactNode
}) {
  const list = useContext(ListContext)
  if (list.variant === 'checklist')
    return (
      <li className="flex items-center gap-2 rounded-site bg-surface-alt px-3 py-2.5 text-[0.875rem]">
        <Icon name="check-circle-fill" className="text-success" />
        <span>{children}</span>
      </li>
    )
  if (list.variant === 'links')
    return <li className="mb-2 [&_a]:flex [&_a]:items-center [&_a]:gap-1.5">{children}</li>
  return (
    <li className="flex items-start gap-2 border-b border-black/4 py-1.5 text-[0.75rem] text-ink last:border-b-0">
      <Icon
        name={icon ?? list.icon}
        className={cn(
          'mt-0.5 shrink-0 text-[0.6875rem] text-primary',
          // Legacy `.info-box i` adds a 16px bottom margin to list icons in boxes, not in cards.
          list.boxed && 'mb-4',
        )}
      />
      {/* Legacy wraps item text in a span, but puts links in the list item directly. */}
      {bare || (isValidElement(children) && children.type === 'a') ? (
        children
      ) : (
        <span>{children}</span>
      )}
    </li>
  )
}

const telHref = (number: string) => `tel:+63${number.replace(/\D/g, '').replace(/^0/, '')}`

/**
 * The address, hours and phone numbers of an office, as a `.req-list`. One number goes in
 * `phone`; several, or numbers with a note, go inside as `<Phone>` items.
 */
export function OfficeInfo({
  address,
  hours,
  phone,
  children,
}: {
  address: string
  hours?: string
  phone?: string
  children?: React.ReactNode
}) {
  return (
    <ul className={listClass}>
      <ListItem icon="geo-alt">{address}</ListItem>
      {hours && <ListItem icon="clock">{hours}</ListItem>}
      {phone && <Phone number={phone} />}
      {children}
    </ul>
  )
}

/** A tap-to-call number in `<OfficeInfo>`, with an optional note such as "(Capitol main line)". */
export function Phone({ number, children }: { number: string; children?: React.ReactNode }) {
  return (
    <ListItem icon="telephone" bare>
      <a href={telHref(number)}>{number}</a>
      {children && <span>{children}</span>}
    </ListItem>
  )
}
