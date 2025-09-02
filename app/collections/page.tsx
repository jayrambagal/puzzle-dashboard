"use client"

import Link from "next/link"
import styles from "./style.module.scss"

const DEFAULTS = [
  { id: "general", name: "General", slug: "general", puzzleCount: 12 },
  { id: "daily", name: "Daily", slug: "daily", puzzleCount: 30 },
  { id: "weekly", name: "Weekly", slug: "weekly", puzzleCount: 8 },
  { id: "special", name: "Special", slug: "special", puzzleCount: 5 },
]

export default function CollectionsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink} aria-label="Back to Dashboard">
          ← Back
        </Link>
        <h1 className={styles.title}>Collections</h1>
        <div className={styles.actions}>
          <Link href="/collections/new" className={styles.createBtn}>
            Create New
          </Link>
        </div>
      </header>

      <section className={styles.section} aria-label="Collections List">
        <div className={styles.listHead}>
          <span>Name</span>
          <span>Slug</span>
          <span>Count</span>
        </div>
        <ul className={styles.list}>
          {DEFAULTS.map((c) => (
            <li key={c.id} className={styles.listRow}>
              <div className={styles.cell}>
                <strong>{c.name}</strong>
              </div>
              <div className={styles.cell}>
                <code>{c.slug}</code>
              </div>
              <div className={styles.cell}>{c.puzzleCount}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
