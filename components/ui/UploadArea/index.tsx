"use client"

import React from "react"
import styles from "./style.module.scss"
import { Button } from "@/components/ui/Button"
import { parseCsv, validateCsvFile } from "@/utils/csv"
import type { IUploadResult } from "@/types/puzzle"

interface IProps {
  onParsed: (result: IUploadResult, file: File) => void
}

export function UploadArea({ onParsed }: IProps) {
  const [dragOver, setDragOver] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>()
  const [fileName, setFileName] = React.useState<string | undefined>()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    setError(undefined)
    if (!files || files.length === 0) return
    const file = files[0]
    const valid = validateCsvFile(file)
    if (!valid.ok) {
      setError(valid.error)
      return
    }
    const questions = await parseCsv(file)
    onParsed({ questions, rowCount: questions.length }, file)
    setFileName(file.name)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.wrap}>
      <div
        className={styles.zone}
        style={{ outline: dragOver ? "2px solid var(--primary, #2563eb)" : "none" }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Upload CSV"
      >
        {"Drag & drop CSV here, or click to select"}
      </div>
      <input ref={inputRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => handleFiles(e.target.files)} />
      <div className={styles.hint}>Must be CSV, under 10MB. Blank rows are removed automatically.</div>
      {fileName ? <div className={styles.fileName}>Selected: {fileName}</div> : null}
      {error ? (
        <div className={styles.error} role="alert">
          {error}
        </div>
      ) : null}
      <div style={{ marginTop: 12 }}>
        <Button variant="ghost" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
      </div>
    </div>
  )
}
