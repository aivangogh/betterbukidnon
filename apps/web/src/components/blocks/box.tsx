import { Children, cloneElement, createContext, isValidElement, useContext } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'

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

type ListOptions = { icon: IconName; note?: string }
const ListContext = createContext<ListOptions>({ icon: 'check-circle-fill' })

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
      <ListContext value={{ icon: listIcon, note }}>{children}</ListContext>
    </div>
  )
}

const listClass = 'm-0 list-none p-0'

export function BulletList({ children }: { children?: React.ReactNode }) {
  const { note } = useContext(ListContext)
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

export function ListItem({ icon, children }: { icon?: IconName; children?: React.ReactNode }) {
  const list = useContext(ListContext)
  return (
    <li className="flex items-start gap-2 border-b border-black/4 py-1.5 text-[0.75rem] text-ink last:border-b-0">
      {/* Legacy `.info-box i` adds a 16px bottom margin to list icons. */}
      <Icon
        name={icon ?? list.icon}
        className="mb-4 mt-0.5 shrink-0 text-[0.6875rem] text-primary"
      />
      {/* Legacy wraps item text in a span, but puts links in the list item directly. */}
      {isValidElement(children) && children.type === 'a' ? children : <span>{children}</span>}
    </li>
  )
}

/** The address, hours and phone number of an office, as a `.req-list`. */
export function OfficeInfo({
  address,
  hours,
  phone,
}: {
  address: string
  hours?: string
  phone?: string
}) {
  return (
    <ul className={listClass}>
      <ListItem icon="geo-alt">{address}</ListItem>
      {hours && <ListItem icon="clock">{hours}</ListItem>}
      {phone && (
        <ListItem icon="telephone">
          <a href={`tel:+63${phone.replace(/\D/g, '').replace(/^0/, '')}`}>{phone}</a>
        </ListItem>
      )}
    </ul>
  )
}
