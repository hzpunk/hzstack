'use client'

import { motion } from 'framer-motion'
import { SocialLink } from '@/model/links'

interface SocialGridProps {
  links: SocialLink[]
}

export function SocialGrid({ links }: SocialGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {links.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FAFAFA] border border-[#070D0D] text-black rounded-none flex items-start justify-end p-2 sm:p-3 hover:bg-black hover:text-white transition-colors relative overflow-hidden group"
            aria-label={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Icon size={24} strokeWidth={1.5} />
            </motion.div>
          </motion.a>
        )
      })}
    </div>
  )
}
