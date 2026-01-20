import { Header } from '@/components/Header'
import type { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <section className="min-h-screen bg-white">
      <Header />
      {children}
    </section>
  )
}
