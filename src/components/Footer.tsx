import { SocialGrid } from './SocialGrid'
import { ContactInfo } from './ContactInfo'
import { BottomBar } from './BottomBar'
import { BrandBanner } from './BrandBanner'

import {
  Instagram,
  Send,
  Youtube,
  X,
  Music2,
  AtSign,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="mx-auto max-w-[1120px] px-8 pt-24">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-10">
          <div className="flex flex-col">
            <ContactInfo />

            <nav className="mt-6 flex flex-col gap-2 font-cygre text-[12px] leading-none text-brand-grey">
              <a className="hover:opacity-70 transition-opacity" href="/tutors">
                репетиторы
              </a>
              <a className="hover:opacity-70 transition-opacity" href="/lessons">
                мои занятия
              </a>
              <a className="hover:opacity-70 transition-opacity" href="/profile">
                профиль
              </a>
              <a className="hover:opacity-70 transition-opacity" href="/notifications">
                уведомления
              </a>
              <a className="hover:opacity-70 transition-opacity" href="/favorites">
                избранное
              </a>
              <a className="hover:opacity-70 transition-opacity" href="/messages">
                сообщения
              </a>
            </nav>
          </div>

          <div className="shrink-0 md:self-start self-center">
            <SocialGrid
              links={[
                { label: 'Telegram', href: 'https://t.me', icon: Send },
                { label: 'VK', href: 'https://vk.com', icon: AtSign },
                { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
                { label: 'X', href: 'https://x.com', icon: X },
                { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
                { label: 'TikTok', href: 'https://tiktok.com', icon: Music2 },
              ]}
            />
          </div>
        </div>

        <div className="mt-28 pb-8">
          <BottomBar />
        </div>
      </div>

      <BrandBanner />
    </footer>
  )
}
