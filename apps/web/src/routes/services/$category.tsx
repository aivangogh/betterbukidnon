import { createFileRoute, notFound } from '@tanstack/react-router'
import { PageHeader } from '@/components/content/page-header'
import { useLocale } from '@/components/i18n/locale-provider'
import { CharterNote } from '@/components/content/charter-note'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon, type IconName } from '@/components/ui/icon'
import { SiteLink } from '@/components/ui/site-link'
import { serviceCategories } from '@/content/service-categories'

export const Route = createFileRoute('/services/$category')({
  loader: ({ params }) => {
    const page = serviceCategories[params.category]
    if (!page) throw notFound()
    return page
  },
  component: ServiceCategoryPage,
})

// Legacy .section.section-compact: 24px, but 32px from 768px to 1024px wide.
const compact = 'py-6 max-xl:py-8 max-md:py-6'

function ServiceCategoryPage() {
  const page = Route.useLoaderData()
  const { t, l } = useLocale()

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t('nav-home'), link: { to: '/' } },
          { label: t('nav-services'), link: { to: '/services' } },
          { label: l(page.breadcrumb) },
        ]}
      />
      <PageHeader
        badge={l(page.badge)}
        icon={page.icon as IconName}
        title={l(page.title)}
        description={l(page.description)}
      />

      {page.contacts.length > 0 && (
        <section className={compact}>
          <div className="container-site">
            <div className="flex flex-wrap gap-2.5">
              {page.contacts.map((contact) => (
                <SiteLink
                  key={contact.href}
                  href={contact.href}
                  className="flex items-center gap-2.5 rounded-[10px] border border-black/8 bg-white px-4 py-3 text-[0.875rem] text-ink no-underline hover:text-primary-dark"
                >
                  <Icon name={contact.icon as IconName} className="text-[1.125rem] text-primary" />
                  <span>
                    <strong className="block text-[0.75rem] font-semibold text-ink-light">
                      {l(contact.label)}
                    </strong>
                    <span>{l(contact.value)}</span>
                  </span>
                </SiteLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.sections.map((section) => (
        <section key={section.title.en} className="section-y">
          <div className="container-site">
            <h2 className="mb-1 mt-0 text-[1.25rem]">{l(section.title)}</h2>
            {section.intro && (
              <p className="mb-6 mt-0 max-w-190 text-ink-light">{l(section.intro)}</p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 max-xl:grid-cols-2 max-md:grid-cols-1 min-[1200px]:grid-cols-3">
              {section.cards.map((card) => (
                <div
                  key={card.title.en}
                  className="flex flex-col gap-2 rounded-[10px] border border-black/8 bg-white p-4.5"
                >
                  <h3 className="m-0 flex items-center gap-2 text-[1rem]">
                    <Icon name={card.icon as IconName} className="text-primary" />
                    <span>{l(card.title)}</span>
                  </h3>
                  <p className="m-0 text-[0.875rem] leading-[1.6] text-ink">{l(card.text)}</p>
                  {card.link && (
                    <SiteLink
                      href={card.link.href}
                      className="mt-auto text-[0.8125rem] font-semibold text-primary no-underline hover:underline"
                    >
                      <span>{l(card.link.label)}</span> <Icon name="arrow-right" />
                    </SiteLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className={compact}>
        <div className="container-site">
          <CharterNote
            text={l(page.note.text)}
            href={page.note.link.href}
            label={l(page.note.link.label)}
            end="."
          />
        </div>
      </section>
    </>
  )
}
