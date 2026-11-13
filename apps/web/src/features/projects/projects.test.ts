import { expect, it } from 'vite-plus/test'
import bootstrapIcons from 'bootstrap-icons/font/bootstrap-icons.json' with { type: 'json' }
import { projectIcon, projects } from './projects'

it('uses only Bootstrap Icons that exist for projects', () => {
  for (const project of projects) expect(bootstrapIcons).toHaveProperty(projectIcon(project))
})
