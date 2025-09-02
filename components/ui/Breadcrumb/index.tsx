"use client"

import Link from "next/link"
import styles from "./style.module.scss"

export type Crumb = { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className={styles.item} aria-current={isLast ? "page" : undefined}>
              {item.href && !isLast ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              {!isLast && <span className={styles.sep}>/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
