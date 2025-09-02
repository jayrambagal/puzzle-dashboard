"use client"

import type React from "react"
import styles from "./style.module.scss"

interface IProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ title, open, onClose, children, actions }: IProps) {
  if (!open) return null
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>{title}</div>
        <div>{children}</div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>
  )
}
