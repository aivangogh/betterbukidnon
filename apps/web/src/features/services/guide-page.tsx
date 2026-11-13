import { DocumentBody } from '@/components/blocks/document-body'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { PageHeader } from '@/components/layout/page-header'
import type { IconName } from '@/components/ui/icon'
import { localized } from '@/lib/i18n'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'
import { serviceCategories } from './categories'
import type { ServiceGuide } from './guides'

/** A service guide written as a document (`content/services/<slug>`). */
export function ServiceGuidePage({ path, locale, meta }: ServiceGuide) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: m.nav_home(), link: { to: '/' } },
          { label: m.nav_services(), link: { to: '/services' } },
          ...parentCrumb(meta.parent),
          { label: meta.shortTitle },
        ]}
      />
      {/* An untranslated page shows the English text; mark it so screen readers read it as English. */}
      <div lang={locale === getLocale() ? undefined : locale}>
        <PageHeader
          badge={meta.badge}
          icon={meta.icon as IconName}
          title={meta.title}
          description={meta.summary}
        />
        <DocumentBody path={path} />
      </div>
    </>
  )
}

function parentCrumb(parent: string | undefined) {
  if (parent === '/government')
    return [{ label: m.nav_government(), link: { to: '/government' } } as const]
  const id = parent?.replace('/services/', '')
  const category = id ? serviceCategories[id] : undefined
  if (!id || !category) return []
  return [
    {
      label: localized(category.breadcrumb),
      link: { to: '/services/$category', params: { category: id } },
    } as const,
  ]
}
