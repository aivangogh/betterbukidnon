import { Download, FilePenLine } from 'lucide-react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import newsJson from '../../../../data/news.json'
import { newsDataSchema } from '@/content/schemas'

export const Route = createFileRoute('/admin/news-editor')({ component: NewsEditorPage })

function NewsEditorPage() {
  const [value, setValue] = useState(() => JSON.stringify(newsJson, null, 2))
  const [message, setMessage] = useState(
    'Edit validated JSON, then download it for review and commit.',
  )

  function download() {
    try {
      const parsed = newsDataSchema.parse(JSON.parse(value))
      const blob = new Blob([`${JSON.stringify(parsed, null, 2)}\n`], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'news.json'
      anchor.click()
      URL.revokeObjectURL(url)
      setMessage(
        'Valid news.json downloaded. Review and commit it through the repository workflow.',
      )
    } catch (error) {
      setMessage(
        error instanceof Error ? `Invalid news data: ${error.message}` : 'Invalid news data.',
      )
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-civic-100 text-civic-700">
        <FilePenLine />
      </div>
      <p className="mt-6 font-semibold text-civic-700">Maintainer tool</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">News JSON editor</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        This static tool validates data/news.json in your browser. It cannot publish content
        directly; all changes remain reviewable in Git.
      </p>
      <textarea
        aria-label="News JSON"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-8 min-h-96 w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-civic-500"
        spellCheck="false"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-2 rounded-lg bg-civic-700 px-5 py-3 font-semibold text-white hover:bg-civic-800"
        >
          <Download className="size-4" /> Validate and download
        </button>
        <p aria-live="polite" className="text-sm text-slate-600">
          {message}
        </p>
      </div>
    </section>
  )
}
