import type { IPuzzle } from "@/types/puzzle"

export const SAMPLE_PUZZLES: IPuzzle[] = [
  {
    id: "seed-1",
    name: "General Knowledge Quiz",
    author: "Admin",
    publishDate: "2025-01-01T00:00:00.000Z",
    slug: "general-knowledge-quiz",
    language: "English",
    puzzleType: "Quiz",
    collectionType: "General",
    status: "Published",
    questions: [
      {
        questionNumber: 1,
        question: "What is the capital of France?",
        optionA: "Paris",
        optionB: "Lyon",
        optionC: "Marseille",
        optionD: "Nice",
        explanationText: "Paris is the capital and most populous city of France.",
      },
    ],
    uploadedByEmail: "uploader@example.com",
    fileSizeBytes: 512,
    dateOfUpload: "2025-01-01T00:00:00.000Z",
    fileName: "general-knowledge.csv",
    thumbnailDataUrl: undefined,
    socialShareDataUrl: undefined,
    copyright: "",
  },
]
