"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { Button } from "@/components/ui/Button"
import styles from "./style.module.scss"
import theme from "@/app/styles/style.module.scss"
import { usePuzzles } from "@/hooks/usePuzzles"

export default function EditLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const router = useRouter()
  const { getById, deletePuzzle } = usePuzzles()
  const puzzle = getById(id)

  // Redirect /edit to /edit/basic
  useEffect(() => {
    if (pathname?.endsWith("/edit")) {
      router.replace(`/puzzles/${id}/edit/basic`)
    }
  }, [pathname, id, router])

  const tabs = [
    { label: "Basic Info", href: `/puzzles/${id}/edit/basic` },
    { label: "Gameplay Settings", href: `/puzzles/${id}/edit/gameplay` },
    { label: "Messaging", href: `/puzzles/${id}/edit/messaging` },
  ]

  function onSave() {
    window.dispatchEvent(new CustomEvent("edit-save"))
  }

  function onDelete() {
    const ok = confirm("Delete this quiz? This cannot be undone.")
    if (!ok) return
    deletePuzzle(id)
    router.push("/dashboard")
  }

  const crumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Puzzles", href: "/dashboard" },
    { label: puzzle?.name || "Edit" },
  ]

  return (
    <div className={theme.root}>
      <main className={theme.container}>
        <Breadcrumb items={crumbs} />

        <header className={styles.header}>
          <h1 className={styles.title}>{puzzle?.name || "Edit Puzzle"}</h1>
          <div className={styles.actions}>
            {/* Use supported variants: primary (default) and ghost */}
            <Button variant="ghost" onClick={onDelete}>
              Delete quiz
            </Button>
            <Button onClick={onSave}>Save changes</Button>
          </div>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Edit sections">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href)
            return (
              <Link key={t.href} href={t.href} className={active ? styles.tabActive : styles.tab}>
                {t.label}
              </Link>
            )
          })}
        </div>

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  )
}
