import type { TPuzzleKind, TPuzzleStatus } from "@/types/puzzle"

export const LANGUAGES = ["English", "Hindi", "Spanish", "French"] as const

export const PUZZLE_KINDS: ReadonlyArray<TPuzzleKind> = ["Quiz", "Crossword", "Word Search", "Sudoku"]

export const PUZZLE_STATUSES: ReadonlyArray<TPuzzleStatus> = ["Draft", "Published", "Archived"]
