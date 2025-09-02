"use client"

import { useEffect, useMemo, useState } from "react"
import { seedCollections } from "@/constants/collections"

export type Collection = {
  id: string
  name: string
  slug: string
  puzzleCount?: number
}

const STORAGE_KEY = "v0.collections.v1"

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setCollections(JSON.parse(raw))
      } else {
        setCollections(seedCollections)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCollections))
      }
    } catch (e) {
      console.log("[v0] collections load error:", (e as Error).message)
      setCollections(seedCollections)
    }
  }, [])

  const value = useMemo(() => ({ collections, setCollections }), [collections])
  return value
}
