import { Suspense, use } from 'react'
import { loadDocumentModule } from '@/lib/content'
import { documentComponents } from '.'

function Body({ path }: { path: string }) {
  const { default: Content } = use(loadDocumentModule(path))
  return <Content components={documentComponents} />
}

/**
 * Renders a document's MDX with the allowed blocks. While its chunk loads during hydration,
 * the prerendered HTML stays on screen.
 */
export function DocumentBody({ path }: { path: string }) {
  return (
    <Suspense>
      <Body path={path} />
    </Suspense>
  )
}
