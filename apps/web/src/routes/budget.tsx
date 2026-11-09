import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, PhilippinePeso } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
import { fiscalData } from '@/content/civic-data'

export const Route = createFileRoute('/budget')({ component: BudgetPage })

function BudgetPage() {
  return (
    <SectionPage
      eyebrow="Transparency"
      title="Budget and financial records"
      description="Provincial budget, revenue, expenditure, and infrastructure information with links to official sources."
      icon={PhilippinePeso}
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
            className="mt-5 inline-flex items-center gap-2 font-semibold text-civic-700"
          >
            Visit BLGF <ExternalLink className="size-4" />
          </a>
        </div>
      ) : null}
    </SectionPage>
  )
}
