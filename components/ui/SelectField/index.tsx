import React from "react"
import styles from "./style.module.scss"

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: ReadonlyArray<string>
  error?: string
  hint?: string
}

export function SelectField({ label, options, error, hint, id, ...rest }: IProps) {
  const inputId = React.useId()
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <select className={styles.select} id={inputId} {...rest}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && !error ? <div className={styles.help}>{hint}</div> : null}
      {error ? (
        <div className={styles.error} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  )
}
