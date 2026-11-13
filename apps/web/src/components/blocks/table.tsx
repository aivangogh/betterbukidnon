import { createContext, useContext } from 'react'

/**
 * Markdown tables in documents, in the legacy `.fee-table` styles: a blue header row (office
 * guides) or, inside a `<Topic>`, the light header of the guide layout. `<Danger>` marks a
 * cell in red (such as a penalty) and `<TableNote>` is the small source line under a table.
 */
type TableStyle = 'blue' | 'light'
const TableContext = createContext<TableStyle>('blue')

export function TableScope({ value, children }: { value: TableStyle; children: React.ReactNode }) {
  return <TableContext value={value}>{children}</TableContext>
}

export function Table({ children }: { children?: React.ReactNode }) {
  if (useContext(TableContext) === 'light')
    return (
      // Legacy `.table-responsive`: cells at least 100px (the second 300px). It scrolls
      // sideways; legacy let it overflow below 768px, which made the whole page scroll.
      <div className="relative w-full overflow-x-auto [&_td]:min-w-25 [&_td:nth-child(2)]:min-w-75 [&_th]:min-w-25 [&_th:nth-child(2)]:min-w-75">
        <table className="mt-6 w-full border-collapse text-[0.875rem] [&_tr:hover]:bg-surface-alt">
          {children}
        </table>
      </div>
    )
  return (
    <table className="w-full border-collapse overflow-hidden rounded-site border border-black/6 bg-white text-[0.75rem] [&_tr:hover_td]:bg-primary/2 [&_tr:last-child_td]:border-b-0">
      {children}
    </table>
  )
}

export function TableHeading({ children }: { children?: React.ReactNode }) {
  if (useContext(TableContext) === 'light')
    return (
      <th className="border-b border-line bg-surface-alt p-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-ink">
        {children}
      </th>
    )
  return (
    <th className="bg-primary px-3 py-2.5 text-left text-[0.6875rem] font-semibold uppercase text-white">
      {children}
    </th>
  )
}

export function TableCell({ children }: { children?: React.ReactNode }) {
  if (useContext(TableContext) === 'light')
    return <td className="border-b border-line p-3 text-left">{children}</td>
  return <td className="border-b border-black/4 px-3 py-2">{children}</td>
}

export function Danger({ children }: { children: React.ReactNode }) {
  return <span className="text-danger">{children}</span>
}

export function TableNote({ children }: { children: React.ReactNode }) {
  // A div: formatted MDX puts the text on its own lines, which makes it a paragraph.
  return <div className="mt-2 text-[0.6875rem] text-ink-light [&_p]:m-0">{children}</div>
}
