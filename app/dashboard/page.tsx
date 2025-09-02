"use client"

import React from "react"
import Link from "next/link"
import theme from "@/app/styles/style.module.scss"
import styles from "@/app/dashboard/style.module.scss"
import { UploadArea } from "@/components/ui/UploadArea"
import { Button } from "@/components/ui/Button"
import { CollectionPicker } from "@/components/collections/CollectionPicker"
import { Table } from "@/components/ui/Table"
import { EditIcon } from "@/components/icons/EditIcon"
import { usePuzzles } from "@/hooks/usePuzzles"
import { LANGUAGES, PUZZLE_KINDS } from "@/constants/puzzles"
import type { IUploadResult, IPuzzle } from "@/types/puzzle"
import Breadcrumb from "@/components/ui/Breadcrumb"

export default function DashboardPage() {
  const { puzzles, addPuzzle } = usePuzzles()

  const [collection, setCollection] = React.useState<string>("General")
  const [language, setLanguage] = React.useState<string>(LANGUAGES[0])
  const [puzzleType, setPuzzleType] = React.useState<string>(PUZZLE_KINDS[0])
  const [lastUpload, setLastUpload] = React.useState<IUploadResult | null>(null)
  const [lastFile, setLastFile] = React.useState<File | null>(null)

  const onParsed = (res: IUploadResult, file: File) => {
    setLastUpload(res)
    setLastFile(file)
  }

  const quickCreate = () => {
    if (!lastUpload || !lastFile) return
    const name = lastFile.name.replace(/\.csv$/i, "")
    addPuzzle(
      name || "Untitled Puzzle",
      "Admin",
      language,
      puzzleType as IPuzzle["puzzleType"],
      collection,
      lastUpload,
      {
        fileName: lastFile.name,
        fileSizeBytes: lastFile.size,
        uploadedByEmail: "uploader@example.com",
        dateOfUpload: new Date().toISOString(),
      },
    )
    setLastUpload(null)
    setLastFile(null)
  }

  const columns = [
    { header: "Puzzle Name", key: "name" as const },
    { header: "Author", key: "author" as const },
    { header: "Date of Publish", render: (p: IPuzzle) => new Date(p.publishDate).toLocaleDateString() },
    { header: "Status", key: "status" as const },
    { header: "Puzzle Type", key: "puzzleType" as const },
    { header: "Collection Type", key: "collectionType" as const },
    {
      header: "Actions",
      render: (p: IPuzzle) => (
        <Link href={`/puzzles/${p.id}/edit`} aria-label={`Edit ${p.name}`} style={{ textDecoration: "none" }}>
          <Button variant="ghost" iconLeft={<EditIcon />}>
            Edit
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className={theme.root}>
      <main className={theme.container}>
        <Breadcrumb items={[{ label: "Dashboard" }]} />
        <section className={theme.section}>
          <div className={styles.header}>
            <h1 className={theme.h1}>Puzzle Dashboard (Quizzop™)</h1>
          </div>
          <div className={styles.kpis} style={{ marginTop: 12 }}>
            <div className={styles.kpi}>
              <div className={styles.kpiTitle}>Total Puzzles</div>
              <div className={styles.kpiValue}>{puzzles.length}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiTitle}>Drafts</div>
              <div className={styles.kpiValue}>{puzzles.filter((p) => p.status === "Draft").length}</div>
            </div>
            <div className={styles.kpi}>
              <div className={styles.kpiTitle}>Published</div>
              <div className={styles.kpiValue}>{puzzles.filter((p) => p.status === "Published").length}</div>
            </div>
          </div>
        </section>

        <div className={theme.stack16} style={{ marginTop: 16 }}>
          <section className={theme.section}>
            <h2 className={theme.h2}>1. Upload Puzzle (CSV Upload)</h2>
            <UploadArea onParsed={onParsed} />
            <div className={theme.badge} style={{ marginTop: 8 }}>
              {lastUpload ? `Parsed ${lastUpload.rowCount} rows` : "Waiting for CSV..."}
            </div>
          </section>

          <section className={theme.section}>
            <h2 className={theme.h2}>2. Collections</h2>
            <div className={theme.grid2}>
              <CollectionPicker value={collection} onChange={setCollection} />
              <div className={theme.stack12}>
                <label style={{ fontSize: 14, fontWeight: 600 }}>Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ padding: 10, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                  aria-label="Language"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <label style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Puzzle Type</label>
                <select
                  value={puzzleType}
                  onChange={(e) => setPuzzleType(e.target.value)}
                  style={{ padding: 10, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}
                  aria-label="Puzzle Type"
                >
                  {PUZZLE_KINDS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div>
                  <Button disabled={!lastUpload || !lastFile} onClick={quickCreate}>
                    Create From Upload
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className={theme.section}>
            <h2 className={theme.h2}>3. Uploaded Files</h2>
            <Table<IPuzzle> columns={columns} rows={puzzles} rowKey={(r) => r.id} />
          </section>
        </div>
      </main>
    </div>
  )
}
