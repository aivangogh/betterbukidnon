import { createFileRoute } from '@tanstack/react-router'
import { officials } from '@/content/civic-data'

export const Route = createFileRoute('/government/officials')({
  component: OfficialsPage,
})

function OfficialsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
      <p className="font-semibold text-primary">Term {officials.term}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Elected officials of Bukidnon</h1>
      <p className="mt-4 text-slate-600">
        Last verified{' '}
        {new Date(`${officials.last_verified}T00:00:00`).toLocaleDateString('en-PH', {
          dateStyle: 'long',
        })}
        .
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <OfficialGroup
          title="Provincial executive"
          people={[officials.governor, officials.vice_governor]}
        />
        <OfficialGroup title="Congressional representatives" people={officials.representatives} />
        <OfficialGroup title="Sangguniang Panlalawigan" people={officials.board_members} />
        <OfficialGroup
          title="Ex officio members"
          people={officials.ex_officio.map((member) => ({
            name: member.name,
            title: member.seat,
          }))}
        />
      </div>
      <div className="mt-12 rounded-xl bg-slate-100 p-6">
        <h2 className="font-bold">Sources</h2>
        <ul className="mt-3 space-y-2">
          {officials.sources.map((source) => (
            <li key={source.url}>
              <a
                className="font-medium text-primary underline"
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function OfficialGroup({
  title,
  people,
}: {
  title: string
  people: ReadonlyArray<{ name: string; title?: string; district?: number }>
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {people.map((person) => (
          <li key={person.name} className="p-4">
            <span className="font-semibold text-slate-950">{person.name}</span>
            <span className="mt-1 block text-sm text-slate-500">
              {person.title ?? (person.district ? `District ${person.district}` : '')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
