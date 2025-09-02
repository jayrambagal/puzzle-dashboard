"use client"
import styles from "./style.module.scss"
import Link from "next/link"

export interface CollectionPickerProps {
  value: string
  onChange: (val: string) => void
}

const DEFAULT_COLLECTIONS = ["General", "Daily", "Weekly", "Special"]

export function CollectionPicker({ value, onChange }: CollectionPickerProps) {
  return (
    <div className={styles.wrap}>
      <label className={styles.label}>Collection</label>
      <div className={styles.row}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Collection"
        >
          {DEFAULT_COLLECTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Link href="/collections" className={styles.createLink} aria-label="Go to Collections">
          Create New
        </Link>
      </div>
    </div>
  )
}
