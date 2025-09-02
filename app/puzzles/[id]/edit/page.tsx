"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditRedirect() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  useEffect(() => {
    if (id) router.replace(`/puzzles/${id}/edit/basic`)
  }, [id, router])

  return null
}
