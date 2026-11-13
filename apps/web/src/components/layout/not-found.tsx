import { SiteLink } from '@/components/ui/site-link'
import { m } from '@/paraglide/messages'

const button =
  'inline-block rounded-site border-2 px-6 py-3 text-center font-semibold no-underline transition-all duration-200 hover:no-underline max-md:px-5 max-md:py-2.5 max-md:text-[0.9375rem]'

/** Legacy 404.html (`.error-page`), shown for any URL without a route. */
export function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-12">
      {/* React places these in <head>; a missing page must not be indexed. */}
      <title>{`${m.err404_title()} | BetterBukidnon.org`}</title>
      <meta name="robots" content="noindex" />
      <div className="container-site text-center">
        <span className="mb-4 block text-[6rem] font-extrabold leading-none tracking-[-4px] text-primary">
          404
        </span>
        <h1 className="mb-4 text-[1.75rem] text-ink">{m.err404_title()}</h1>
        <p className="mb-8 text-[1rem] text-ink-light">{m.err404_text()}</p>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <SiteLink
            href="/"
            className={`${button} border-transparent bg-primary text-white hover:-translate-y-0.5 hover:bg-primary-dark hover:text-white hover:shadow-md`}
          >
            {m.err404_home()}
          </SiteLink>
          <SiteLink
            href="/services"
            className={`${button} border-primary bg-white text-primary hover:bg-surface-alt`}
          >
            {m.err404_services()}
          </SiteLink>
        </div>
      </div>
    </section>
  )
}
