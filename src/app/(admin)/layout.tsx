import { Header } from '@/components/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-white">
      <Header />
      {children}
    </section>
  )
}
