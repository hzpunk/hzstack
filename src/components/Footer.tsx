'use client'

import { motion } from 'framer-motion'
import { socialLinks, navLinks } from '@/model/links'
import { SocialGrid } from './SocialGrid'
import { NavLinks } from './NavLinks'
import { ContactInfo } from './ContactInfo'
import { BottomBar } from './BottomBar'
import { BrandBanner } from './BrandBanner'

export function Footer() {
  return (
    <motion.footer
      className="w-full z-10 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-4 mb-12">
          {/* Левая колонка: Контакты + Навигация */}
          <div className="flex flex-col gap-8 text-center md:text-left">
            <ContactInfo />
            <NavLinks links={navLinks} />
          </div>
          {/* Правая колонка: Сетка соцсетей */}
          <div className="flex flex-col items-center md:items-end">
            <SocialGrid links={socialLinks} />
          </div>
        </div>

        <div className="mb-8">
          <BottomBar />
        </div>
      </div>

      {/* Огромный баннер */}
      <BrandBanner />
    </motion.footer>
  )
}
