'use client'

import { motion } from 'framer-motion'

export function ContactInfo() {
  return (
    <motion.div
      className="flex flex-col gap-2 text-black text-sm min-w-[180px] items-center md:items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="cursor-pointer hover:opacity-70 transition-opacity">
        hzcompanyteam@gmail.com
      </span>
      <span className="cursor-pointer hover:opacity-70 transition-opacity">
        +79255672398
      </span>
    </motion.div>
  )
}
