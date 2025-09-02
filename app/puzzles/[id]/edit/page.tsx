"use client"

import React from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import theme from "@/app/styles/style.module.scss"
import styles from "../../edit/style.module.scss"
import { usePuzzles } from "@/hooks/usePuzzles"
import { Button } from "@/components/ui/Button"
import { InputField } from "@/components/ui/InputField"
import { TextAreaField } from "@/components/ui/TextAreaField"
import { SelectField } from "@/components/ui/SelectField"
import { LANGUAGES, PUZZLE_KINDS } from "@/constants/puzzles"
import { toSlug } from "@/utils/slug"
import type { IPuzzle } from "@/types/puzzle"
import { UploadArea } from "@/components/ui/UploadArea"

export default function EditPuzzlePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { getById, updatePuzzle, deletePuzzle } = usePuzzles()
  const puzzle = getById(params.id)

  const [model, setModel] = React.useState<IPuzzle | null>(puzzle ?? null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (puzzle) setModel(puzzle)
  }, [puzzle])

  if (!puzzle || !model) return notFound()

  const setField = <K extends keyof IPuzzle>(key: K, value: IPuzzle[K]) => {
    setModel((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const onChangeName = (v: string) => {
    setField("name", v)
    setField("slug", toSlug(v))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!model.name.trim()) e.name = "Puzzle Name is required"
    if (!model.author.trim()) e.author = "Author Name is required"
    if (!model.publishDate) e.publishDate = "Publish Date is required"
    if (!model.slug.trim()) e.slug = "Slug is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSave = () => {
    if (!validate() || !model) return
    updatePuzzle(model)
    router.push("/dashboard")
  }

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

  const onImagePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "thumbnailDataUrl" | "socialShareDataUrl",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setField(key, dataUrl)
  }

  const downloadCsv = () => {
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
    <div className={theme.root}>
      <main className={theme.container}>
        <div className={theme.section}>
          <h1 className={theme.h1}>Edit Puzzle</h1>
        </div>

        <div className={theme.stack16} style={{ marginTop: 16 }}>
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
                onChange={(e) => onChangeName(e.target.value)}
                error={errors.name}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InputField
                  label="Author Name"
                  value={model.author}
                  onChange={(e) => setField("author", e.target.value)}
                  error={errors.author}
                />
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600 }}>Publish Date</label>
                  <input
                    type="date"
                    value={model.publishDate.slice(0, 10)}
                    onChange={(e) => setField("publishDate", new Date(e.target.value).toISOString())}
                    aria-label="Publish Date"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  {errors.publishDate ? (
                    <div style={{ color: "#b91c1c", fontSize: 12 }}>{errors.publishDate}</div>
                  ) : null}
                </div>
              </div>
              <InputField
                label="Slug"
                value={model.slug}
                onChange={(e) => setField("slug", e.target.value)}
                error={errors.slug}
                hint="Auto-generated from name, can be edited."
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
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
              <div className={styles.media}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Thumbnail Image Upload</div>
                  <div className={styles.preview}>
                    {model.thumbnailDataUrl ? (
                      <img
                        className={styles.previewImg}
                        alt="Thumbnail preview"
                        src={
                          model.thumbnailDataUrl ||
                          "/placeholder.svg?height=140&width=280&query=thumbnail%20placeholder" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                      />
                    ) : (
                      "No image selected"
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImagePick(e, "thumbnailDataUrl")}
                    style={{ marginTop: 8 }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Social Share Image Upload</div>
                  <div className={styles.preview}>
                    {model.socialShareDataUrl ? (
                      <img
                        className={styles.previewImg}
                        alt="Social share preview"
                        src={
                          model.socialShareDataUrl ||
                          "/placeholder.svg?height=140&width=280&query=social%20share%20placeholder" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                      />
                    ) : (
                      "No image selected"
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImagePick(e, "socialShareDataUrl")}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </div>
              <TextAreaField
                label="Copyright Information"
                placeholder="Add copyright or licensing details..."
                value={model.copyright ?? ""}
                onChange={(e) => setField("copyright", e.target.value)}
              />
              <div className={styles.row} style={{ justifyContent: "space-between" }}>
                <Button onClick={onSave}>Save Changes</Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    deletePuzzle(model.id)
                    history.back()
                  }}
                  aria-label="Delete quiz"
                >
                  Delete Quiz
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
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

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(String(reader.result))
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}
