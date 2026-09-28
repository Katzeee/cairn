import type { ReactNode } from "react";

export type NodeTableColumn = Readonly<{ key: string; heading: ReactNode }>;
export type NodeTableRow = Readonly<{ key: string; cells: ReadonlyMap<string, ReactNode> }>;

/** The table owns geometry; each cell hosts an independently addressable node editing region. */
export function NodeTable({
  label,
  columns,
  rows,
  footer,
}: Readonly<{
  label: string;
  columns: readonly NodeTableColumn[];
  rows: readonly NodeTableRow[];
  footer?: ReactNode;
}>) {
  return (
    <div className="cairn-NodeTableViewport" data-ui="node-table" tabIndex={0}>
      <table aria-label={label} className="cairn-NodeTable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="cairn-NodeTableHeading"
              >
                {column.heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {columns.map((column) => (
                <td key={column.key} className="cairn-NodeTableCell">
                  {row.cells.get(column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer}
    </div>
  );
}
