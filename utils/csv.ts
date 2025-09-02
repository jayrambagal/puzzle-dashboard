import type { IQuestion } from "@/types/puzzle"

export interface ICSVValidation {
  ok: boolean
  error?: string
}

export function validateCsvFile(file: File): ICSVValidation {
  const isCsv = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")
  if (!isCsv) return { ok: false, error: "File must be a CSV (.csv)" }
  const max = 10 * 1024 * 1024
  if (file.size > max) return { ok: false, error: "File size must be < 10MB" }
  return { ok: true }
}

// Minimal CSV parsing that handles commas within quotes
export async function parseCsv(file: File): Promise<IQuestion[]> {
  const text = await file.text()
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  const nonBlank = lines.filter((l) => l.length > 0)
  if (nonBlank.length <= 1) return []

  const header = splitCsvLine(nonBlank[0]).map((h) => h.toLowerCase())

  const mapIndex = (name: string) => header.findIndex((h) => h.includes(name.toLowerCase()))

  const colIdx = {
    questionNumber: mapIndex("question number"),
    question: mapIndex("question"),
    optionA: mapIndex("option a"),
    optionB: mapIndex("option b"),
    optionC: mapIndex("option c"),
    optionD: mapIndex("option d"),
    questionImageLink: mapIndex("question image link"),
    imageCredits: mapIndex("image credits"),
    hintText: mapIndex("hint"),
    explanationText: mapIndex("explanation"),
    tag: mapIndex("tag"),
  }

  const rows: IQuestion[] = []
  for (let i = 1; i < nonBlank.length; i++) {
    const cols = splitCsvLine(nonBlank[i])
    if (cols.every((c) => c.trim().length === 0)) continue

    const numRaw = valueAt(cols, colIdx.questionNumber)
    const num = Number.parseInt(numRaw || `${i}`, 10)

    const q: IQuestion = {
      questionNumber: Number.isFinite(num) ? num : i,
      question: valueAt(cols, colIdx.question) ?? "",
      optionA: valueAt(cols, colIdx.optionA) ?? "",
      optionB: valueAt(cols, colIdx.optionB) ?? "",
      optionC: valueAt(cols, colIdx.optionC) ?? "",
      optionD: valueAt(cols, colIdx.optionD) ?? "",
      questionImageLink: valueAt(cols, colIdx.questionImageLink) || undefined,
      imageCredits: valueAt(cols, colIdx.imageCredits) || undefined,
      hintText: valueAt(cols, colIdx.hintText) || undefined,
      explanationText: valueAt(cols, colIdx.explanationText) || undefined,
      tag: valueAt(cols, colIdx.tag) || undefined,
    }

    rows.push(q)
  }
  return rows
}

function valueAt(arr: string[], idx: number): string | undefined {
  if (idx < 0 || idx >= arr.length) return undefined
  const v = arr[idx]?.trim()
  return v?.length ? v : undefined
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur)
      cur = ""
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}
