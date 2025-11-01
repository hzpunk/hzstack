import React from 'react'
import styles from './Button.module.scss'

export interface ButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
}

export const Button = ({ text, onClick, disabled }: ButtonProps) => {
  return (
    <div
      className={styles.button}
      onClick={!disabled ? onClick : undefined}
      style={{
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {text}
    </div>
  )
}
