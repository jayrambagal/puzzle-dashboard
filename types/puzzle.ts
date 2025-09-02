export type TUUID = string

export interface IQuestion {
  questionNumber: number
  question: string
  optionA: string // correct answer
  optionB: string
  optionC: string
  optionD: string
  questionImageLink?: string
  imageCredits?: string
  hintText?: string
  explanationText?: string
  tag?: string
}

export type TPuzzleStatus = "Draft" | "Published" | "Archived"
export type TPuzzleKind = "Quiz" | "Crossword" | "Word Search" | "Sudoku"

export interface IPuzzleFileMeta {
  uploadedByEmail: string
  fileSizeBytes: number
  dateOfUpload: string // ISO
  fileName: string
}

export interface IPuzzleMedia {
  thumbnailDataUrl?: string
  socialShareDataUrl?: string
}

export interface IPuzzle extends IPuzzleFileMeta, IPuzzleMedia {
  id: TUUID
  name: string
  author: string
  publishDate: string // ISO
  slug: string
  language: string
  puzzleType: TPuzzleKind
  collectionType: string
  status: TPuzzleStatus
  questions: IQuestion[]
  copyright?: string
  scoring?: IPuzzleScoring
  display?: IPuzzleDisplay
  media?: IPuzzleGameplayMedia
  contestMode?: boolean
  messaging?: IPuzzleMessaging
}

export interface IUploadResult {
  questions: IQuestion[]
  rowCount: number
}

export interface IPuzzleScoring {
  pointsPerCorrect: number
  penaltyPerWrong: number
  timeBonusPerSecond: number
}

export interface IPuzzleDisplay {
  shuffleQuestions: boolean
  showHints: boolean
  questionsPerPage: number
}

export interface IPuzzleGameplayMedia {
  correctMediaDataUrl?: string
  wrongMediaDataUrl?: string
}

export interface IPuzzleMessaging {
  start: string
  pause: string
  end: string
}
