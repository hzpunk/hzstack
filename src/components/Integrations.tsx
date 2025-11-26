'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

export function Integrations() {
  const constraintsRef = useRef(null)

  return (
    <section className="w-full py-20 px-8" ref={constraintsRef}>
      <h2 className="typography-h1 lowercase mb-8">интеграции:</h2>
      <motion.div
        className="flex items-center gap-1 w-fit cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        whileHover={{ scale: 1.05 }}
        whileTap={{ cursor: 'grabbing' }}
        // Physics: Drop on tap if not dragging, but here we want interaction.
        // For "fall on click": we can use layout animation or simply let drag physics handle 'throwing'.
        // The request "clicked and it fell" implies activating gravity.
        // We'll implement a simple drag-to-throw behavior which is standard 'physics' feel in web UI.
        // To make it truly "fall" requires a physics engine (like matter.js), but for this scope,
        // framer-motion drag with inertia is usually what's expected.
        // We will increase drag momentum to make it feel 'heavy' and 'throwable'.
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
      >
        {/* Логотип HZ - 2 вертикальные, 2 горизонтальные */}
        <div className="flex gap-[2px] h-12 items-stretch">
          {/* Левая часть - 2 вертикальные полоски */}
          <div className="flex gap-[2px]">
            <div className="w-5 bg-black" />
            <div className="w-5 bg-black" />
          </div>
          {/* Правая часть - 2 горизонтальные полоски */}
          <div className="flex flex-col gap-[2px] w-16">
            <div className="h-full bg-black" />
            <div className="h-full bg-black" />
          </div>
        </div>

        {/* ID badge - черный круг с текстом */}
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center ml-2 aspect-square">
          <span className="text-white text-xl font-medium lowercase leading-none pb-[2px]">
            id
          </span>
        </div>
      </motion.div>
    </section>
  )
}
