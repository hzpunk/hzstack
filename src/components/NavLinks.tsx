'use client'

import { motion } from 'framer-motion'
import { NavLink } from '@/model/links'

interface NavLinksProps {
  links: NavLink[]
}

export function NavLinks({ links }: NavLinksProps) {
  return (
    <div className="mt-6 flex flex-col items-center md:items-start gap-2">
      {links.map((link, index) => (
        <motion.a
          whileHover={{ opacity: 0.6, x: 5 }}
          whileTap={{ scale: 0.95 }}
          key={link.label}
          href={link.href}
          className="text-black transition-all text-sm lowercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  )
}
