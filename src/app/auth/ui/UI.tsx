'use client'

import React from 'react'
import styles from './UI.module.scss'

export const UI = ({children}: {children: React.ReactNode}) => {
  return (
    <div className={styles.ui}>
      {children}
    </div>
  )
}
