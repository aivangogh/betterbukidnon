import { Icon } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'

/** Legacy `.charter-note`: the volunteer-guide disclaimer with a link to the official source. */
export function CharterNote({
  text,
  href,
  label,
  end = '',
}: {
  text: string
  href: string
  label: string
  /** Text after the link; the category pages end the sentence with a period. */
  end?: string
}) {
  return (
    <div
      role="note"
      className="flex items-start gap-2.5 rounded-site border border-l-4 border-black/8 border-l-primary bg-white px-4 py-3.5 text-[0.8125rem] leading-[1.6]"
    >
      <Icon name="info-circle-fill" className="mt-0.5 text-primary" />
      <p className="m-0">
        <span>{text}</span>{' '}
        <SiteLink
          href={href}
          className="font-semibold text-primary underline hover:text-primary-dark"
        >
          <span>{label}</span>
        </SiteLink>
        {end}
      </p>
    </div>
  )
}
