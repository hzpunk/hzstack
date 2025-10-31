import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.scss'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Hzhr — быстрый поиск работы для студентов',
  description: 'Платформа для поиска работы студентами и работодателями. Быстро, легко, без заморочек.',
  keywords: 'вакансии студентам, поиск работы, стажировки',
}

import { AuthProvider } from '@/components/AuthProvider'
import { QueryProvider } from '@/components/QueryProvider'
import Header from '@/components/layout/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

