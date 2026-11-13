/**
 * Legacy `.fee-table`, used for Markdown tables in documents: a blue header row and thin row
 * lines. `<Danger>` marks a cell in red (such as a penalty) and `<TableNote>` is the small
 * source line under a table.
 */
export function Table({ children }: { children?: React.ReactNode }) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-site border border-black/6 bg-white text-[0.75rem] [&_tr:hover_td]:bg-primary/2 [&_tr:last-child_td]:border-b-0">
      {children}
    </table>
  )
}

export function TableHeading({ children }: { children?: React.ReactNode }) {
  return (
    <th className="bg-primary px-3 py-2.5 text-left text-[0.6875rem] font-semibold uppercase text-white">
      {children}
    </th>
  )
}

export function TableCell({ children }: { children?: React.ReactNode }) {
  return <td className="border-b border-black/4 px-3 py-2">{children}</td>
}

export function Danger({ children }: { children: React.ReactNode }) {
  return <span className="text-danger">{children}</span>
}

export function TableNote({ children }: { children: React.ReactNode }) {
  // A div: formatted MDX puts the text on its own lines, which makes it a paragraph.
  return <div className="mt-2 text-[0.6875rem] text-ink-light [&_p]:m-0">{children}</div>
}
