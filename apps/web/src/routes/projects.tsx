import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/content/page-header'
import { useLocale } from '@/components/i18n/locale-provider'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Icon } from '@/components/ui/icon'
import {
  projectHost,
  projectIcon,
  projectRepoLabel,
  projectRepoNames,
  projects,
  projectStatuses,
  unique,
} from '@/content/projects'
import type { Project, ProjectStatus } from '@/content/schemas'
import { isTranslationKey } from '@/content/translations'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/projects')({ component: ProjectsPage })

const statusBadge: Record<ProjectStatus, string> = {
  active: 'bg-[#d9f4ea] text-[#04654b]',
  development: 'bg-[#fff0dc] text-[#8a4500]',
  archived: 'bg-[#e9ecef] text-[#495057]',
}

const mono = "font-[ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace]"

function useProjectText() {
  const { t } = useLocale()
  // Translation keys follow the legacy `proj-<id>-name` pattern; JSON text is the fallback.
  const lookup = (key: string, fallback: string) => (isTranslationKey(key) ? t(key) : fallback)
  return {
    t,
    name: (project: Project) => lookup(`proj-${project.id}-name`, project.name),
    description: (project: Project) => lookup(`proj-${project.id}-desc`, project.description),
    category: (slug: string) =>
      lookup(`proj-cat-${slug}`, slug.charAt(0).toUpperCase() + slug.slice(1)),
  }
}

function ProjectBadges({ project, className }: { project: Project; className?: string }) {
  const { t, category } = useProjectText()
  const badge =
    'rounded-sm bg-white/95 px-2.5 py-0.75 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-primary-dark'
  return (
    <div
      className={cn(
        'absolute inset-x-3 top-3 flex flex-wrap gap-1.5 text-[0.75rem] leading-[1.6]',
        className,
      )}
    >
      <span className={cn(badge, statusBadge[project.status])}>
        {t(`proj-tab-${project.status}`)}
      </span>
      <span className={cn(badge, 'bg-[#fde8ec] text-[#a4112e]')}>
        {t(`proj-type-${project.type}`)}
      </span>
      <span className={cn(badge, 'ml-auto')}>{category(project.category)}</span>
    </div>
  )
}

function ProjectMedia({ project, tall }: { project: Project; tall?: boolean }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-linear-135 from-primary to-secondary text-[3rem] text-white/90',
        tall ? 'h-45' : 'h-35',
      )}
    >
      <Icon name={projectIcon(project)} />
    </div>
  )
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (opener: HTMLButtonElement) => void
}) {
  const { t, name, description } = useProjectText()
  return (
    <li className="flex flex-col overflow-hidden rounded-site border border-[#e3e6ea] bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative">
        <ProjectMedia project={project} />
        <ProjectBadges project={project} />
        <span className={cn('absolute bottom-2.5 left-3 text-[0.75rem] text-white/90', mono)}>
          {projectRepoLabel(project)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h2 className="m-0 text-[1.25rem]">{name(project)}</h2>
        <p className="m-0 text-ink-light">{description(project)}</p>
        {project.repos.map((repo) => (
          <p
            key={repo.url}
            className={cn('m-0 text-[0.75rem] text-[#8a9099] [overflow-wrap:anywhere]', mono)}
          >
            {repo.url.replace(/^https?:\/\//, '')}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[#f0f2f4] px-6 pb-4 pt-2">
        <span className="text-[0.8125rem] text-[#6b7280] [overflow-wrap:anywhere]">
          {projectHost(project)}
        </span>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => onOpen(event.currentTarget)}
          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent px-1 py-1.5 text-[0.875rem] font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          <span>{t('proj-view-details')}</span>
          <Icon name="arrow-right" />
          <span className="sr-only"> - {name(project)}</span>
        </button>
      </div>
    </li>
  )
}

function ProjectDialog({
  project,
  dialog,
  onClose,
}: {
  project: Project | null
  dialog: React.RefObject<HTMLDialogElement | null>
  onClose: () => void
}) {
  const { t, name, description } = useProjectText()
  const heading = 'mb-1.5 mt-6 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#8a9099]'
  const repos = project?.repos ?? []
  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog element itself is a click on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      className="m-auto max-h-[calc(100vh-48px)] w-[min(560px,calc(100%-32px))] overflow-y-auto rounded-xl border-0 bg-white p-0 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop:bg-[rgba(0,20,60,0.6)]"
    >
      {project && (
        <>
          <div className="relative">
            <ProjectMedia project={project} tall />
            <ProjectBadges project={project} className="right-14" />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="absolute right-2.5 top-2.5 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-black/45 text-[1rem] text-white hover:bg-black/70"
            >
              <Icon name="x-lg" />
              <span className="sr-only">{t('proj-close')}</span>
            </button>
            <span className={cn('absolute bottom-2.5 left-3 text-[0.75rem] text-white/90', mono)}>
              {projectRepoLabel(project)}
            </span>
          </div>
          <div className="p-6">
            <h2 id="project-dialog-title" className="mb-1 mt-0 text-[1.5rem]">
              {name(project)}
            </h2>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-2 font-medium [overflow-wrap:anywhere]"
            >
              {project.url}
            </a>
            <h3 className={heading}>{t('proj-about')}</h3>
            <p>{description(project)}</p>
            <h3 className={heading}>{t('proj-contributors')}</h3>
            <p>
              <a
                href={repos[0] ? `${repos[0].url}/graphs/contributors` : project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t('proj-contributors-link')}</span> <Icon name="box-arrow-up-right" />
                <span className="sr-only">{t('nav-opens-new-tab')}</span>
              </a>
            </p>
            <h3 className={heading}>{t('proj-repository')}</h3>
            <ul className="list-none">
              {repos.map((repo) => (
                <li key={repo.url}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center gap-2 rounded-site border border-[#e3e6ea] bg-surface-alt px-3 py-2.5 text-[0.875rem] text-ink [overflow-wrap:anywhere]',
                      mono,
                    )}
                  >
                    <Icon name="github" />
                    <span>{repo.url.replace(/^https?:\/\//, '')}</span>
                    <Icon name="box-arrow-up-right" />
                    <span className="sr-only">{t('nav-opens-new-tab')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[#e3e6ea] bg-surface-alt px-6 py-4">
            <span className="text-[0.8125rem] text-ink-light">
              {t('proj-repos-count', { count: repos.length })}
            </span>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-site border-2 border-transparent bg-primary px-4 py-2 text-center text-[0.875rem] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-dark hover:text-white hover:no-underline hover:shadow-md focus-visible:shadow-[0_0_0_3px_rgba(247,127,0,0.5)] focus-visible:outline-none max-md:px-3 max-md:py-1.5 max-md:text-[0.8125rem]"
            >
              <span>{t('proj-visit-project')}</span> <Icon name="box-arrow-up-right" />
              <span className="sr-only">{t('nav-opens-new-tab')}</span>
            </a>
          </div>
        </>
      )}
    </dialog>
  )
}

function ProjectsPage() {
  const { t, name, description, category: categoryLabel } = useProjectText()
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [query, setQuery] = useState('')
  const [repo, setRepo] = useState('')
  const [category, setCategory] = useState('')
  const [openProject, setOpenProject] = useState<Project | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])

  // Search and both filters apply to every tab, so the tab counts follow them (legacy behavior).
  const filtered = projects.filter((project) => {
    if (repo && !projectRepoNames(project).includes(repo)) return false
    if (category && project.category !== category) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [
      name(project),
      description(project),
      projectRepoNames(project).join(' '),
      categoryLabel(project.category),
      projectHost(project),
    ]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
  const visible = filtered.filter((project) => project.status === status)

  const selectTab = (index: number) => {
    const next = projectStatuses[(index + projectStatuses.length) % projectStatuses.length]
    if (!next) return
    setStatus(next)
    tabs.current[projectStatuses.indexOf(next)]?.focus()
  }

  // Open after the project's content has rendered, so focus lands inside the dialog.
  useEffect(() => {
    const element = dialog.current
    if (!openProject || !element || element.open) return
    element.showModal()
    element.scrollTop = 0
    document.body.style.overflow = 'hidden'
  }, [openProject])

  const closeDetails = () => {
    document.body.style.overflow = ''
    setOpenProject(null)
    opener.current?.focus()
  }

  const control = 'min-h-11 w-full rounded-site border border-[#c9ced4] bg-white px-3.5 text-ink'

  return (
    <>
      <Breadcrumbs
        items={[{ label: t('proj-home'), link: { to: '/' } }, { label: t('proj-title') }]}
      />
      <PageHeader
        badge={t('proj-badge')}
        icon="grid-3x3-gap-fill"
        title={t('proj-title')}
        description={t('proj-subtitle')}
      />
      <section className="section-y bg-surface-alt">
        <div className="container-site">
          <div
            role="tablist"
            aria-labelledby="projects-tabs-label"
            className="mb-6 flex flex-wrap gap-2 border-b-2 border-[#e3e6ea]"
          >
            <span id="projects-tabs-label" className="sr-only">
              {t('proj-tabs-label')}
            </span>
            {projectStatuses.map((tabStatus, index) => {
              const selected = tabStatus === status
              return (
                <button
                  key={tabStatus}
                  ref={(element) => {
                    tabs.current[index] = element
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tabStatus}`}
                  aria-selected={selected}
                  aria-controls="projects-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setStatus(tabStatus)}
                  onKeyDown={(event) => {
                    const target =
                      event.key === 'ArrowRight'
                        ? index + 1
                        : event.key === 'ArrowLeft'
                          ? index - 1
                          : event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? projectStatuses.length - 1
                              : null
                    if (target === null) return
                    event.preventDefault()
                    selectTab(target)
                  }}
                  className={cn(
                    '-mb-0.5 inline-flex cursor-pointer items-center gap-2 border-0 border-b-2 border-transparent bg-transparent px-4 py-2.5 font-semibold text-ink-light hover:text-primary max-[600px]:flex-auto max-[600px]:justify-center max-[600px]:px-2',
                    selected && 'border-primary text-primary',
                  )}
                >
                  <span>{t(`proj-tab-${tabStatus}`)}</span>
                  <span
                    className={cn(
                      'min-w-6 rounded-full bg-[#e3e6ea] px-2 text-center text-[0.75rem] leading-[22px] text-ink',
                      selected && 'bg-primary text-white',
                    )}
                  >
                    {filtered.filter((project) => project.status === tabStatus).length}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative flex-[1_1_260px]">
              <label htmlFor="projects-search" className="sr-only">
                {t('proj-search-label')}
              </label>
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light"
              />
              <input
                type="search"
                id="projects-search"
                placeholder={t('proj-search-placeholder')}
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={cn(control, 'pl-10')}
              />
            </div>
            <div className="flex-[0_1_200px] max-[600px]:flex-[1_1_100%]">
              <label htmlFor="projects-repo" className="sr-only">
                {t('proj-filter-repo-label')}
              </label>
              <select
                id="projects-repo"
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
                className={control}
              >
                <option value="">{t('proj-all-repos')}</option>
                {unique(projects.flatMap(projectRepoNames)).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-[0_1_200px] max-[600px]:flex-[1_1_100%]">
              <label htmlFor="projects-category" className="sr-only">
                {t('proj-filter-category-label')}
              </label>
              <select
                id="projects-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={control}
              >
                <option value="">{t('proj-all-categories')}</option>
                {unique(projects.map((project) => project.category)).map((slug) => (
                  <option key={slug} value={slug}>
                    {categoryLabel(slug)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {t('proj-showing', { count: visible.length })}
          </p>
          <div id="projects-panel" role="tabpanel" aria-labelledby={`tab-${status}`} tabIndex={0}>
            {visible.length > 0 ? (
              <ul
                id="projects-grid"
                className="grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6"
              >
                {visible.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={(button) => {
                      opener.current = button
                      setOpenProject(project)
                    }}
                  />
                ))}
              </ul>
            ) : (
              <p className="px-6 py-12 text-center text-ink-light">{t('proj-empty')}</p>
            )}
          </div>
        </div>
      </section>
      <ProjectDialog project={openProject} dialog={dialog} onClose={closeDetails} />
    </>
  )
}
