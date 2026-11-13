import type { MDXComponents } from 'mdx/types'
import { SiteLink } from '@/components/ui/site-link'
import type { BlockName } from '@/lib/documents'
import { BulletList, Box, ListItem, NumberedList, OfficeInfo, Prose } from './box'
import { Card, Cards, Stat, Stats } from './cards'
import { CharterNote, LinkButton } from './notes'
import { Columns, Section } from './section'

/**
 * The blocks a document (`content/**\/*.mdx`) may use, plus the Markdown elements they
 * restyle. The content tests check documents against `blockNames`.
 */
const blocks = {
  Box,
  Card,
  Cards,
  CharterNote,
  Columns,
  LinkButton,
  OfficeInfo,
  Prose,
  Section,
  Stat,
  Stats,
} satisfies Record<BlockName, unknown>

export const documentComponents: MDXComponents = {
  ...blocks,
  a: ({ href = '', children }) => <SiteLink href={href}>{children}</SiteLink>,
  ul: BulletList,
  ol: NumberedList,
  li: ListItem,
}
