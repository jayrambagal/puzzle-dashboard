"use client"

import useSWR from "swr"
import { getLocal, setLocal } from "@/utils/storage"
import type { IPuzzle, IUploadResult, TPuzzleKind } from "@/types/puzzle"
import { uuid } from "@/utils/id"
import { toSlug } from "@/utils/slug"
import { SAMPLE_PUZZLES } from "@/seed/puzzles"

const KEY = "quizzop_puzzles_v1"

const fetcher = (): IPuzzle[] => {
  return getLocal<IPuzzle[]>(KEY, SAMPLE_PUZZLES)
}

export function usePuzzles() {
  const { data, mutate, isLoading } = useSWR<IPuzzle[]>(KEY, fetcher, { revalidateOnFocus: false })

  const save = (next: IPuzzle[]) => {
    setLocal(KEY, next)
    mutate(next, { revalidate: false })
  }

  return {
    puzzles: data ?? [],
    isLoading,
    addPuzzle: (
      name: string,
      author: string,
      language: string,
      puzzleType: TPuzzleKind,
      collectionType: string,
      upload: IUploadResult,
      fileMeta: Pick<IPuzzle, "fileName" | "fileSizeBytes" | "uploadedByEmail" | "dateOfUpload">,
    ) => {
      const newPuzzle: IPuzzle = {
        id: uuid(),
        name,
        author,
        publishDate: new Date().toISOString(),
        slug: toSlug(name),
        language,
        puzzleType,
        collectionType,
        status: "Draft",
        questions: upload.questions,
        thumbnailDataUrl: undefined,
        socialShareDataUrl: undefined,
        copyright: "",
        ...fileMeta,
      }
      const next = [newPuzzle, ...(data ?? [])]
      save(next)
      return newPuzzle
    },
    updatePuzzle: (updated: IPuzzle) => {
      const next = (data ?? []).map((p) => (p.id === updated.id ? updated : p))
      save(next)
    },
    deletePuzzle: (id: string) => {
      save((data ?? []).filter((p) => p.id !== id))
    },
    getById: (id: string) => (data ?? []).find((p) => p.id === id),
  }
}
