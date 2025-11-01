import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.scss'
import { Header } from '@/shared'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Hzhr — быстрый поиск работы для студентов',
  description: 'Платформа для поиска работы студентами и работодателями. Быстро, легко, без заморочек.',
  keywords: 'вакансии студентам, поиск работы, стажировки',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

