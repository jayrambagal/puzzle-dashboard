"use client"

import React from "react"
import { useParams } from "next/navigation"
import { usePuzzles } from "@/hooks/usePuzzles"
import theme from "@/app/styles/style.module.scss"
import styles from "../style.module.scss"
import { Button } from "@/components/ui/Button"
import { InputField } from "@/components/ui/InputField"
import { SelectField } from "@/components/ui/SelectField"
import { UploadArea } from "@/components/ui/UploadArea"
import { LANGUAGES, PUZZLE_KINDS } from "@/constants/puzzles"
import type { IPuzzle } from "@/types/puzzle"

export default function EditBasicPage() {
  const { id } = useParams<{ id: string }>()
  const { getById, updatePuzzle } = usePuzzles()
  const puzzle = getById(id)
  const [model, setModel] = React.useState<IPuzzle | null>(puzzle ?? null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (puzzle) setModel(puzzle)
  }, [puzzle])

  React.useEffect(() => {
    function onSave() {
      if (!model) return
      const e: Record<string, string> = {}
      if (!model.name.trim()) e.name = "Puzzle Name is required"
      if (!model.author.trim()) e.author = "Author Name is required"
      if (!model.publishDate) e.publishDate = "Publish Date is required"
      if (!model.slug.trim()) e.slug = "Slug is required"
      setErrors(e)
      if (Object.keys(e).length === 0) updatePuzzle(model)
    }
    window.addEventListener("edit-save", onSave)
    return () => window.removeEventListener("edit-save", onSave)
  }, [model, updatePuzzle])

  if (!model) return <p className={styles.muted}>Puzzle not found.</p>

  const setField = <K extends keyof IPuzzle>(k: K, v: IPuzzle[K]) => setModel((m) => (m ? { ...m, [k]: v } : m))

  const onUploadNewFile = (res: { questions: IPuzzle["questions"]; rowCount: number }, file: File) => {
    setModel((m) =>
      m
        ? {
            ...m,
            questions: res.questions,
            fileName: file.name,
            fileSizeBytes: file.size,
            dateOfUpload: new Date().toISOString(),
          }
        : m,
    )
  }

  function csvEscape(s: string): string {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  function downloadCsv() {
    const rows = [
      [
        "Question Number",
        "Question",
        "Option A (Correct Answer)",
        "Option B",
        "Option C",
        "Option D",
        "Question Image Link",
        "Image Credits",
        "Hint Text",
        "Explanation Text",
        "Tag",
      ],
      ...model.questions.map((q) => [
        q.questionNumber,
        q.question,
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
        q.questionImageLink ?? "",
        q.imageCredits ?? "",
        q.hintText ?? "",
        q.explanationText ?? "",
        q.tag ?? "",
      ]),
    ]
    const csv = rows.map((r) => r.map((s) => csvEscape(String(s))).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${model.slug || "puzzle"}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className={theme.section}>
        <h2 className={theme.h2}>File Information</h2>
        <div className={styles.metaGrid}>
          <div className={styles.card}>
            <div>
              <strong>Uploaded By:</strong> {model.uploadedByEmail}
            </div>
            <div>
              <strong>File Size:</strong> {formatBytes(model.fileSizeBytes)}
            </div>
            <div>
              <strong>Date of Upload:</strong> {new Date(model.dateOfUpload).toLocaleString()}
            </div>
            <div>
              <strong>File Name:</strong> {model.fileName}
            </div>
            <div className={styles.row} style={{ marginTop: 10 }}>
              <Button onClick={downloadCsv}>Download Puzzle CSV</Button>
            </div>
          </div>
          <div className={styles.card}>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Upload New File (override)</div>
            <UploadArea onParsed={onUploadNewFile} />
          </div>
        </div>
      </section>

      <section className={theme.section}>
        <h2 className={theme.h2}>Puzzle Information</h2>
        <div className={theme.stack12}>
          <InputField
            label="Puzzle Name"
            value={model.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
          />
          <div className={styles.grid2}>
            <InputField
              label="Author Name"
              value={model.author}
              onChange={(e) => setField("author", e.target.value)}
              error={errors.author}
            />
            <div>
              <label className={styles.label}>Publish Date</label>
              <input
                type="date"
                value={model.publishDate.slice(0, 10)}
                onChange={(e) => setField("publishDate", new Date(e.target.value).toISOString())}
                aria-label="Publish Date"
                className={styles.input}
              />
              {errors.publishDate ? <div className={styles.error}>{errors.publishDate}</div> : null}
            </div>
          </div>
          <InputField
            label="Slug"
            value={model.slug}
            onChange={(e) => setField("slug", e.target.value)}
            error={errors.slug}
            hint="Auto-generated from name, can be edited."
          />
          <div className={styles.grid3}>
            <SelectField
              label="Language"
              value={model.language}
              onChange={(e) => setField("language", e.target.value)}
              options={LANGUAGES as unknown as ReadonlyArray<string>}
            />
            <SelectField
              label="Puzzle Type"
              value={model.puzzleType}
              onChange={(e) => setField("puzzleType", e.target.value as IPuzzle["puzzleType"])}
              options={PUZZLE_KINDS as unknown as ReadonlyArray<string>}
            />
            <SelectField
              label="Status"
              value={model.status}
              onChange={(e) => setField("status", e.target.value as IPuzzle["status"])}
              options={["Draft", "Published", "Archived"]}
            />
          </div>
          <InputField
            label="Collection Type"
            value={model.collectionType}
            onChange={(e) => setField("collectionType", e.target.value)}
          />
        </div>
      </section>
    </>
  )
}

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"]
  let b = bytes
  let u = 0
  while (b >= 1024 && u < units.length - 1) {
    b /= 1024
    u++
  }
  return `${b.toFixed(1)} ${units[u]}`
}
