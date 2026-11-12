import { HotlineBar } from './hotline-bar'
import { InfoBar } from './info-bar'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { m } from '@/paraglide/messages'

// Same order as the legacy pages: skip link, hotline bar, header, info bar, content, footer.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="absolute -top-10 left-0 z-[1001] bg-hotline p-2 text-white transition-[top] duration-200 focus:top-0"
      >
        {m.nav_skip_to_main_content()}
      </a>
      <HotlineBar />
      <SiteHeader />
      <InfoBar />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  )
}
