import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { ReactNode } from 'react'

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
