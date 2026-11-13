import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/projects/projects-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/projects')({
  head: () =>
    seo({
      title: m.seo_projects_title(),
      description: m.seo_projects_description(),
      path: '/projects',
    }),
  component: ProjectsPage,
})
