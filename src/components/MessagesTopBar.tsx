'use client'

import { useRouter } from 'next/navigation'

export function MessagesTopBar() {
  const router = useRouter()

  return (
    <header className="w-full bg-white">
      <div className="w-full px-8 pt-6 pb-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="назад"
            onClick={() => router.back()}
            className="h-8 w-8 flex items-center justify-center text-brand-black hover:opacity-70 transition-opacity"
          >
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3L5 7L9 11"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h1 className="font-cygre font-normal text-brand-black text-[40px] leading-none uppercase">
            сообщения
          </h1>
        </div>
      </div>
    </header>
  )
}
