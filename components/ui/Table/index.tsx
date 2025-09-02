import type React from "react"
import styles from "./style.module.scss"

export interface IColumn<T> {
  header: string
  key?: keyof T // if omitted, render must be provided
  render?: (row: T) => React.ReactNode
}

interface IProps<T> {
  columns: Array<IColumn<T>>
  rows: T[]
  rowKey: (row: T) => string
}

export function Table<T>({ columns, rows, rowKey }: IProps<T>) {
  return (
    <div className={styles.tableWrap} role="region" aria-label="Uploaded Files">
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            {columns.map((c, i) => (
              <th key={`h-${i}`} className={styles.th}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)}>
              {columns.map((c, i) => (
                <td key={`c-${i}`} className={styles.td}>
                  {c.render ? c.render(r) : c.key ? String((r as Record<string, unknown>)[String(c.key)] ?? "") : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
