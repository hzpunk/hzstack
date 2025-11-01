'use client'

import React from 'react'
import styles from './Header.module.scss'
import { Icon, BurgerMenu, Profile } from './components'

export const Header = () => {
  return (
    <div className={styles.header} style={{ position: 'relative' }}>
      <Icon />
      <BurgerMenu />
      <Profile />
    </div>
  )
}
