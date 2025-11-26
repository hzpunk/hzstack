'use client'

import { motion } from 'framer-motion'

export function BottomBar() {
  return (
    <motion.div
      className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-black pb-4 md:pb-2 text-center md:text-left gap-2 md:gap-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <span>designed by Ivan Peter</span>
      <span>© HZcompany 2025</span>
      <span>Все права защищены</span>
    </motion.div>
  )
}
