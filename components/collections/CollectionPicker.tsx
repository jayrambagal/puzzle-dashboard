"use client"

import React from "react"
import Link from "next/link"
import { DEFAULT_COLLECTIONS } from "@/constants/collections"
import { Button } from "../ui/Button"
import { SelectField } from "../ui/SelectField"
import type { ICollection } from "@/types/collection"

interface IProps {
  value: string
  onChange: (v: string) => void
}

export function CollectionPicker({ value, onChange }: IProps) {
  const [collections] = React.useState<ICollection[]>([...DEFAULT_COLLECTIONS])
  const options = React.useMemo(() => collections.map((c) => c.name), [collections])

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
        <Link href="/collections" aria-label="Go to Collections">
          <Button variant="ghost">Create New Collection</Button>
        </Link>
      </div>
    </div>
  )
}
