'use client'

import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import Image from 'next/image'

export function HeaderProfile() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 hover:opacity-70 transition-opacity"
    >
      {/* Аватар */}
      <div className="w-9 h-9 bg-[#E5E5E5] relative overflow-hidden">
        {user.avatar && (
          <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
        )}
      </div>
      {/* Инфо */}
      <div className="flex flex-col leading-none gap-1">
        <span className="typography-h2 lowercase">
          {user.lastName} {user.firstName.charAt(0)}.
        </span>
        <span className="text-[16px] text-gray-500 lowercase font-sans">
          {user.role || 'user'}
        </span>
      </div>
    </Link>
  )
}
