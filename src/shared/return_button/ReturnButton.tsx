'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import './ReturnButton.scss'

export const ReturnButton = () => {
  const router = useRouter()

  const handleReturn = () => {
    router.back()
  }

  return (
    <button className="return-button" onClick={handleReturn}>
      Return
    </button>
  )
}
