"use client"

import React from "react"
import { useParams } from "next/navigation"
import { usePuzzles } from "@/hooks/usePuzzles"
import theme from "@/app/styles/style.module.scss"
import styles from "../style.module.scss"
import { InputField } from "@/components/ui/InputField"

type Scoring = { pointsPerCorrect: number; penaltyPerWrong: number; timeBonusPerSecond: number }
type Display = { shuffleQuestions: boolean; showHints: boolean; questionsPerPage: number }
type Media = { correctMediaDataUrl?: string; wrongMediaDataUrl?: string }

function ensureDefaults(m: any): { scoring: Scoring; display: Display; media: Media; contestMode: boolean } {
  return {
    scoring: m?.scoring ?? { pointsPerCorrect: 10, penaltyPerWrong: 0, timeBonusPerSecond: 0 },
    display: m?.display ?? { shuffleQuestions: true, showHints: true, questionsPerPage: 10 },
    media: m?.media ?? { correctMediaDataUrl: "", wrongMediaDataUrl: "" },
    contestMode: !!m?.contestMode,
  }
}

export default function EditGameplayPage() {
  const { id } = useParams<{ id: string }>()
  const { getById, updatePuzzle } = usePuzzles()
  const base = getById(id)
  const [model, setModel] = React.useState<any>(base ?? null)

  React.useEffect(() => {
    if (base) setModel(base)
  }, [base])

  React.useEffect(() => {
    function onSave() {
      if (!model) return
      const { scoring, display, media, contestMode } = ensureDefaults(model)
      updatePuzzle({ ...model, scoring, display, media, contestMode })
    }
    window.addEventListener("edit-save", onSave)
    return () => window.removeEventListener("edit-save", onSave)
  }, [model, updatePuzzle])

  if (!model) return <p className={styles.muted}>Puzzle not found.</p>

  const def = ensureDefaults(model)

  return (
    <section className={theme.section}>
      <h2 className={theme.h2}>Gameplay Settings</h2>
      <div className={theme.stack12}>
        <div className={styles.grid3}>
          <InputField
            label="Points per Correct"
            type="number"
            value={String(def.scoring.pointsPerCorrect)}
            onChange={(e) =>
              setModel((m: any) => ({
                ...m,
                scoring: { ...ensureDefaults(m).scoring, pointsPerCorrect: Number(e.target.value) || 0 },
              }))
            }
          />
          <InputField
            label="Penalty per Wrong"
            type="number"
            value={String(def.scoring.penaltyPerWrong)}
            onChange={(e) =>
              setModel((m: any) => ({
                ...m,
                scoring: { ...ensureDefaults(m).scoring, penaltyPerWrong: Number(e.target.value) || 0 },
              }))
            }
          />
          <InputField
            label="Time Bonus / sec"
            type="number"
            value={String(def.scoring.timeBonusPerSecond)}
            onChange={(e) =>
              setModel((m: any) => ({
                ...m,
                scoring: { ...ensureDefaults(m).scoring, timeBonusPerSecond: Number(e.target.value) || 0 },
              }))
            }
          />
        </div>

        <div className={styles.grid3}>
          <div>
            <label className={styles.label}>Shuffle Questions</label>
            <input
              type="checkbox"
              checked={def.display.shuffleQuestions}
              onChange={(e) =>
                setModel((m: any) => ({
                  ...m,
                  display: { ...ensureDefaults(m).display, shuffleQuestions: e.target.checked },
                }))
              }
            />
          </div>
          <div>
            <label className={styles.label}>Show Hints</label>
            <input
              type="checkbox"
              checked={def.display.showHints}
              onChange={(e) =>
                setModel((m: any) => ({ ...m, display: { ...ensureDefaults(m).display, showHints: e.target.checked } }))
              }
            />
          </div>
          <InputField
            label="Questions per Page"
            type="number"
            value={String(def.display.questionsPerPage)}
            onChange={(e) =>
              setModel((m: any) => ({
                ...m,
                display: { ...ensureDefaults(m).display, questionsPerPage: Math.max(1, Number(e.target.value) || 1) },
              }))
            }
          />
        </div>

        <div className={styles.media}>
          <div>
            <div className={styles.label}>Correct Answer Media (URL)</div>
            <input
              className={styles.input}
              placeholder="https://..."
              value={def.media.correctMediaDataUrl || ""}
              onChange={(e) =>
                setModel((m: any) => ({
                  ...m,
                  media: { ...ensureDefaults(m).media, correctMediaDataUrl: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <div className={styles.label}>Wrong Answer Media (URL)</div>
            <input
              className={styles.input}
              placeholder="https://..."
              value={def.media.wrongMediaDataUrl || ""}
              onChange={(e) =>
                setModel((m: any) => ({
                  ...m,
                  media: { ...ensureDefaults(m).media, wrongMediaDataUrl: e.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label} htmlFor="contest-mode">
            Enable Contest Mode
          </label>
          <input
            id="contest-mode"
            type="checkbox"
            checked={def.contestMode}
            onChange={(e) => setModel((m: any) => ({ ...m, contestMode: e.target.checked }))}
          />
        </div>
      </div>
    </section>
  )
}
