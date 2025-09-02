import type React from "react"
import styles from "./style.module.scss"

type TVariant = "primary" | "ghost"
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TVariant
  full?: boolean
  iconLeft?: React.ReactNode
}

export function Button({ variant = "primary", full, iconLeft, children, ...rest }: IButtonProps) {
  return (
    <button className={[styles.button, styles[variant], full ? styles.full : ""].join(" ").trim()} {...rest}>
      {iconLeft ? <span className={styles.iconLeft}>{iconLeft}</span> : null}
      {children}
    </button>
  )
}

export default Button
