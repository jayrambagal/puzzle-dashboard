"use client"

import Link from "next/link"
import { useState } from "react"

export default function NewCollectionPage() {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <Link href="/collections" aria-label="Back to Collections">
          ← Back
        </Link>
        <h1 style={{ fontWeight: 700, fontSize: 20 }}>Create New Collection</h1>
        <div />
      </header>

      <section
        style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, background: "#fff" }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Daily Trivia"
            aria-label="Collection Name"
            style={{ padding: 10, border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
          />
          <label style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Description (optional)</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="Short description..."
            aria-label="Collection Description"
            style={{ padding: 10, border: "1px solid var(--border)", borderRadius: "var(--radius)" }}
          />
          <div>
            <button
              type="button"
              onClick={() => alert(`Created (dummy): ${name || "Untitled"}`)}
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "var(--radius)",
                border: 0,
                fontWeight: 600,
              }}
            >
              Create
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
