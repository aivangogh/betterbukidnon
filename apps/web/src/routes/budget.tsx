import { createFileRoute } from '@tanstack/react-router'
import { Icon } from '@/components/ui/icon'
import { SectionPage } from '@/components/layout/section-page'
import { fiscalData } from '@/features/transparency/data'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/budget')({
  head: () =>
    seo({ title: m.seo_budget_title(), description: m.seo_budget_description(), path: '/budget' }),
  component: BudgetPage,
})

function BudgetPage() {
  return (
    <SectionPage
      eyebrow="Transparency"
      title="Budget and financial records"
      description="Provincial budget, revenue, expenditure, and infrastructure information with links to official sources."
      icon="shield-check"
    >
      {fiscalData.fiscal_years.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <h2 className="text-xl font-bold text-slate-950">
            No verified fiscal dataset published yet
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            This portal will not publish placeholder figures. Consult the Bureau of Local Government
            Finance while verified Bukidnon records are being prepared.
          </p>
          <a
            href="https://blgf.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
          >
            Visit BLGF <Icon name="box-arrow-up-right" className="text-base" />
          </a>
        </div>
      ) : null}
    </SectionPage>
  )
}
