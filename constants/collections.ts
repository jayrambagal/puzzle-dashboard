import type { ICollection } from "@/types/collection"

export const DEFAULT_COLLECTIONS: ReadonlyArray<ICollection> = [
  { id: "general", name: "General", createdAt: new Date().toISOString() },
  { id: "science", name: "Science", createdAt: new Date().toISOString() },
  { id: "history", name: "History", createdAt: new Date().toISOString() },
  { id: "sports", name: "Sports", createdAt: new Date().toISOString() },
]
