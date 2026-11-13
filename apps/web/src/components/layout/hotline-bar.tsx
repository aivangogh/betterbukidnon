import { Icon } from '@/components/ui/icon'
import { hotlineBarItems } from '@/config/navigation'
import { cn } from '@/lib/utils'

function HotlineLinks({ copy = false }: { copy?: boolean }) {
  return hotlineBarItems.map((item) => (
    <a
      key={item.href}
      href={item.href}
      aria-hidden={copy || undefined}
      tabIndex={copy ? -1 : undefined}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[20px] bg-white/15 px-2.5 py-1 text-white no-underline transition hover:-translate-y-px hover:bg-white/30',
        // At 1024px and below the pill is drawn by ::before so the link keeps a 44px tap target.
        'max-xl:relative max-xl:z-0 max-xl:min-h-11 max-xl:bg-transparent max-xl:px-3 max-xl:py-0 max-xl:text-[0.75rem] max-xl:before:absolute max-xl:before:inset-x-0 max-xl:before:inset-y-2 max-xl:before:-z-10 max-xl:before:rounded-[20px] max-xl:before:bg-white/15 max-xl:before:transition-colors max-xl:hover:translate-y-0 max-xl:hover:bg-transparent max-xl:hover:before:bg-white/30',
        'max-sm:text-[0.6875rem]',
        copy && 'xl:hidden',
      )}
    >
      <Icon name={item.icon} className="text-[0.75rem]" />
      <span>
        {item.short}: {item.display}
      </span>
    </a>
  ))
}

export function HotlineBar() {
  return (
    <div className="bg-linear-135 from-hotline to-hotline-dark py-2 text-[0.8125rem] text-white max-xl:overflow-hidden max-xl:py-0">
      <div className="container-site max-xl:max-w-full max-xl:px-0">
        <div className="flex w-full items-center overflow-hidden max-xl:motion-reduce:overflow-x-auto">
          {/* Below 1025px the list scrolls as a marquee; the second copy closes the loop. */}
          <div className="flex flex-wrap items-center gap-4 max-xl:flex-nowrap max-xl:animate-hotline-scroll max-xl:will-change-transform max-xl:hover:[animation-play-state:paused] max-xl:focus-within:[animation-play-state:paused] max-xl:motion-reduce:animate-none">
            <HotlineLinks />
            <HotlineLinks copy />
          </div>
        </div>
      </div>
    </div>
  )
}
