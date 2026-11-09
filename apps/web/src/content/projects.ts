import projectsJson from '../../../../data/projects.json'
import type { IconName } from '@/components/ui/icon'
import { projectsDataSchema, type Project } from './schemas'

export const projects = projectsDataSchema.parse(projectsJson).projects

export const projectStatuses = ['active', 'development', 'archived'] as const

export const projectIcon = (project: Project) => project.icon.replace(/^bi-/, '') as IconName

export const projectHost = (project: Project) => new URL(project.url).host

/** "Better-Bukidnon/budget" -> "Better-Bukidnon / budget", as on the legacy cards. */
export const projectRepoLabel = (project: Project) =>
  (project.repos[0]?.name ?? '').replace('/', ' / ')

export const projectRepoNames = (project: Project) => project.repos.map((repo) => repo.name)

export const unique = <T>(values: readonly T[]) => [...new Set(values)]
