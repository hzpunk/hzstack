'use client'

import { HeaderLogo } from './HeaderLogo'
import { HeaderProfile } from './HeaderProfile'
import { HeaderActions } from './HeaderActions'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'

export function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <header className="w-full px-8 py-6 flex justify-between items-center bg-white">
      <Link href="/" className="hover:opacity-70 transition-opacity">
        <HeaderLogo />
      </Link>
      <div className="flex items-center gap-8">
        {isAuthenticated ? (
          <HeaderProfile />
        ) : (
          <Link
            href="/register"
            className="typography-h2 lowercase hover:opacity-70 transition-opacity text-[20px] underline decoration-1 underline-offset-4"
          >
            присоединиться
          </Link>
        )}
        <HeaderActions />
      </div>
    </header>
  )
}
