"use client"

import React from "react"
import { toSlug } from "@/utils/slug"
import Button from "@/components/ui/Button"
import InputField from "@/components/ui/InputField"
import styles from "./style.module.scss"
import type { Puzzle } from "@/types/puzzle"

export default function EditForm({ puzzle }: { puzzle: Puzzle }) {
  const [title, setTitle] = React.useState(puzzle.title)
  const [slug, setSlug] = React.useState(puzzle.slug)
  const [date, setDate] = React.useState(puzzle.date)
  const [collection, setCollection] = React.useState(puzzle.collection)

  React.useEffect(() => {
    // auto-update slug when title changes, but allow manual override
    setSlug((s) => (s === toSlug(puzzle.title) ? toSlug(title) : s))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  function handleAutoSlug() {
    setSlug(toSlug(title))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // dummy save
    alert(`Saved:
title=${title}
slug=${slug}
date=${date}
collection=${collection}`)
  }

  return (
    <form onSubmit={handleSave} className={styles.form} aria-labelledby="edit-heading">
      <div className={styles.grid}>
        <InputField label="Title" name="title" value={title} onChange={setTitle} placeholder="Enter title" />
        <div className={styles.slugRow}>
          <InputField label="Slug" name="slug" value={slug} onChange={setSlug} placeholder="auto-generated" />
          <Button type="button" variant="secondary" onClick={handleAutoSlug}>
            Auto-slug
          </Button>
        </div>
        <InputField label="Date" name="date" value={date} onChange={setDate} type="date" />
        <InputField
          label="Collection"
          name="collection"
          value={collection}
          onChange={setCollection}
          placeholder="Daily / Weekly / Special"
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={() => alert("Deleted (dummy)")}>
          Delete
        </Button>
      </div>
    </form>
  )
}
