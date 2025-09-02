"use client"

import React from "react"
import { DEFAULT_COLLECTIONS } from "@/constants/collections"
import { Button } from "../ui/Button"
import { SelectField } from "../ui/SelectField"
import { InputField } from "../ui/InputField"
import { Modal } from "../ui/Modal"
import type { ICollection } from "@/types/collection"

interface IProps {
  value: string
  onChange: (v: string) => void
}

export function CollectionPicker({ value, onChange }: IProps) {
  const [collections, setCollections] = React.useState<ICollection[]>([...DEFAULT_COLLECTIONS])
  const [open, setOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")

  const options = React.useMemo(() => collections.map((c) => c.name), [collections])

  const createCollection = () => {
    const name = newName.trim()
    if (!name) return
    if (collections.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setOpen(false)
      setNewName("")
      onChange(name)
      return
    }
    const next = [
      ...collections,
      { id: name.toLowerCase().replace(/\s+/g, "-"), name, createdAt: new Date().toISOString() },
    ]
    setCollections(next)
    onChange(name)
    setNewName("")
    setOpen(false)
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <SelectField
            label="Collection Type"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={options.length ? (options as unknown as ReadonlyArray<string>) : (["General"] as const)}
          />
        </div>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          Create New Collection
        </Button>
      </div>

      <Modal
        title="Create New Collection"
        open={open}
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createCollection}>Create</Button>
          </>
        }
      >
        <InputField
          label="Collection Name"
          placeholder="e.g., Daily Trivia"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
    </div>
  )
}
