'use client'

import { Bell, Settings } from 'lucide-react'
import Link from 'next/link'

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      {/* Language Switcher */}
      <button className="w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-medium text-black hover:bg-black hover:text-white transition-colors">
        ru
      </button>
      {/* Icons */}
      <Link
        href="/notifications"
        className="text-black hover:opacity-60 transition-opacity"
      >
        <Bell size={20} strokeWidth={1.5} />
      </Link>
      <button className="text-black hover:opacity-60 transition-opacity">
        <Settings size={20} strokeWidth={1.5} />
      </button>
    </div>
  )
}
