import type { MDXComponents } from 'mdx/types'
import { SiteLink } from '@/components/ui/site-link'
import type { BlockName } from '@/lib/documents'
import { BulletList, Box, ListItem, NumberedList, OfficeInfo, Phone, Prose } from './box'
import { Card, Cards, Stat, Stats } from './cards'
import { CharterNote, LinkButton } from './notes'
import { Columns, Section } from './section'
import { Danger, Table, TableCell, TableHeading, TableNote } from './table'

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
  Danger,
  LinkButton,
  OfficeInfo,
  Phone,
  Prose,
  Section,
  Stat,
  Stats,
  TableNote,
} satisfies Record<BlockName, unknown>

export const documentComponents: MDXComponents = {
  ...blocks,
  a: ({ href = '', children }) => <SiteLink href={href}>{children}</SiteLink>,
  ul: BulletList,
  ol: NumberedList,
  li: ListItem,
  table: Table,
  th: TableHeading,
  td: TableCell,
}
