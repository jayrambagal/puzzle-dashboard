"use client"

import React from "react"
import { useParams } from "next/navigation"
import { usePuzzles } from "@/hooks/usePuzzles"
import theme from "@/app/styles/style.module.scss"
import styles from "../style.module.scss"
import { TextAreaField } from "@/components/ui/TextAreaField"

export default function EditMessagingPage() {
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
      const next = {
        ...model,
        messaging: {
          start: model?.messaging?.start || "",
          pause: model?.messaging?.pause || "",
          end: model?.messaging?.end || "",
        },
      }
      updatePuzzle(next)
    }
    window.addEventListener("edit-save", onSave)
    return () => window.removeEventListener("edit-save", onSave)
  }, [model, updatePuzzle])

  if (!model) return <p className={styles.muted}>Puzzle not found.</p>

  return (
    <section className={theme.section}>
      <h2 className={theme.h2}>Messaging</h2>
      <div className={theme.stack12}>
        <div className={styles.stack}>
          <label className={styles.label}>Start Message</label>
          <TextAreaField
            value={model?.messaging?.start || ""}
            onChange={(e) => setModel((m: any) => ({ ...m, messaging: { ...m?.messaging, start: e.target.value } }))}
          />
        </div>
        <div className={styles.stack}>
          <label className={styles.label}>Pause Message</label>
          <TextAreaField
            value={model?.messaging?.pause || ""}
            onChange={(e) => setModel((m: any) => ({ ...m, messaging: { ...m?.messaging, pause: e.target.value } }))}
          />
        </div>
        <div className={styles.stack}>
          <label className={styles.label}>End Message</label>
          <TextAreaField
            value={model?.messaging?.end || ""}
            onChange={(e) => setModel((m: any) => ({ ...m, messaging: { ...m?.messaging, end: e.target.value } }))}
          />
        </div>
      </div>
    </section>
  )
}
