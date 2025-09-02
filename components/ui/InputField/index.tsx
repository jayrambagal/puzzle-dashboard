import React from "react"
import styles from "./style.module.scss"

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function InputField({ label, error, hint, id, ...rest }: IProps) {
  const inputId = React.useId()
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input className={styles.input} id={inputId} {...rest} />
      {hint && !error ? <div className={styles.help}>{hint}</div> : null}
      {error ? (
        <div className={styles.error} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default InputField
