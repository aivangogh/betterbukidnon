import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Newspaper } from 'lucide-react'
import { SectionPage } from '@/components/content/section-page'
import { news } from '@/content/civic-data'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

function NewsPage() {
  return (
    <SectionPage
      eyebrow="Updates"
      title="News and public information"
      description="Curated public-interest updates from verified provincial and government sources."
      icon={Newspaper}
    >
      {news.news.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <h2 className="text-xl font-bold text-slate-950">No verified updates published yet</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            This portal does not publish scraped or unverified headlines. New public-interest
            updates will appear here after their source and publication date are reviewed.
          </p>
          <a
            href="https://bukidnon.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-civic-700"
          >
            Visit the provincial government <ExternalLink className="size-4" />
          </a>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {news.news.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {item.category ? (
                <p className="text-sm font-semibold text-civic-700">{item.category}</p>
              ) : null}
              <h2 className="mt-2 text-xl font-bold text-slate-950">{item.title}</h2>
              {item.date ? (
                <time className="mt-2 block text-sm text-slate-500" dateTime={item.date}>
                  {item.date}
                </time>
              ) : null}
              {item.excerpt ? (
                <p className="mt-3 leading-7 text-slate-600">{item.excerpt}</p>
              ) : null}
              {item.url ? (
                <a
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-civic-700"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read source <ExternalLink className="size-4" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </SectionPage>
  )
}
