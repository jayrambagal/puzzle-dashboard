import React from "react"
import styles from "./style.module.scss"

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function TextAreaField({ label, error, hint, id, ...rest }: IProps) {
  const inputId = React.useId()
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <textarea className={styles.textarea} id={inputId} rows={4} {...rest} />
      {hint && !error ? <div className={styles.help}>{hint}</div> : null}
      {error ? (
        <div className={styles.error} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  )
}
