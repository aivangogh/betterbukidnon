import type { BootstrapIconsId } from 'bootstrap-icons/font/bootstrap-icons'
import { cn } from '@/lib/utils'

export type IconName = BootstrapIconsId

export function Icon({
  name,
  label,
  className,
}: {
  name: IconName
  /** Accessible name; omit for decorative icons next to visible text. */
  label?: string
  className?: string
}) {
  return (
    <i
      className={cn('bi', `bi-${name}`, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
