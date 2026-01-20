import Link from 'next/link'

import { HeaderLogo } from './HeaderLogo'

export function Header() {
  return (
    <header className="w-full bg-white px-8 h-14">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full">
        <div className="flex items-center gap-10">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <HeaderLogo />
          </Link>

          <nav className="flex items-center gap-6 text-[12px] text-brand-black font-cygre">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              главная
            </Link>
            <Link href="/tutors" className="hover:opacity-70 transition-opacity">
              репетиторы
            </Link>
          </nav>
        </div>

        <div className="flex justify-center">
          <input
            className="h-7 w-[340px] border border-brand-black/30 px-3 text-[12px] outline-none font-cygre placeholder:text-brand-grey"
            placeholder="поиск"
            aria-label="поиск"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          <Link
            href="/login"
            className="text-[12px] text-brand-black hover:opacity-70 transition-opacity font-cygre"
          >
            войти
          </Link>
          <Link
            href="/register"
            className="h-7 px-4 bg-brand-black text-white text-[12px] flex items-center justify-center hover:opacity-90 transition-opacity font-cygre"
          >
            зарегистрироваться
          </Link>
        </div>
      </div>
    </header>
  )
}
