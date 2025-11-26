'use client'

import { useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion'

// Utility function to wrap a number within a range
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const stackItems = [
  'nextjs',
  'tailwind / scss',
  'framer-motion',
  'typescript / go',
  'supabase / pgsql',
  'zustand',
  'docker',
  'nginx',
  'prisma',
  'redis',
  'kafka',
  'jest',
  'sentry',
  'hztech',
  'zod + react hook form',
  'gulp',
  'eslint',
  'husky + lint-staged',
  'next-intl',
  'tanstack query',
]

interface ParallaxProps {
  children: React.ReactNode
  baseVelocity: number
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef<number>(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  /**
   * The number of times to repeat the child text should be dynamic based on the size of the text and viewport.
   * For simplicity, we repeat it enough times to ensure it covers the screen width.
   */
  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="font-light text-xl md:text-2xl flex whitespace-nowrap flex-nowrap gap-8 items-center"
        style={{ x }}
      >
        {/* Repeat children multiple times to ensure smooth loop */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex gap-8 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function StackTicker() {
  // We create a custom hook for horizontal scroll interactions via wheel
  const scrollRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Auto-scroll logic setup
  // Base speed is 1.0 (adjusted by velocity in animation frame)

  // Wheel interaction logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current && scrollRef.current.contains(e.target as Node)) {
        // e.deltaY usually gives vertical scroll, we map it to horizontal movement
        // Factor 1.5 as requested
        x.set(x.get() - e.deltaY * 1.5)
      }
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [x])

  // Simplified implementation for "scroll wheel control + auto scroll"
  // Since pure framer-motion parallax is complex to mix with direct wheel control for a single strip,
  // I will use a simpler approach: Auto-scroll animation that gets offset by wheel.

  return (
    <section
      ref={scrollRef}
      className="w-full py-20 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="px-8 mb-8">
        <h2 className="typography-h1 lowercase">наш стек:</h2>
      </div>

      {/* 
        Custom implementation for the specific requirement:
        1. Auto scroll speed 1.0
        2. Wheel scroll speed 1.5
      */}
      <TickerContent />
    </section>
  )
}

function TickerContent() {
  const baseX = useMotionValue(0)
  const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`)

  useAnimationFrame((t, delta) => {
    // Auto scroll speed 1.0 (adjusted for delta time)
    // Base movement per frame.
    // 1.0 speed roughly translates to moving X pixels per frame.
    // Let's say base speed is -0.05% per millisecond
    let moveBy = -0.0025 * delta // Slower speed (0.5x of previous)
    baseX.set(baseX.get() + moveBy)
  })

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if hovering ticker section
      // For global wheel capture affecting this component:
      // e.deltaY * 1.5 factor
      // We convert pixel delta to percentage roughly to match baseX unit
      // Assuming 1920px width, 1px is ~0.05%
      const moveBy = -(e.deltaY * 1.5) * 0.005
      baseX.set(baseX.get() + moveBy)
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [baseX])

  return (
    <div className="flex whitespace-nowrap overflow-hidden">
      <motion.div
        className="flex gap-16 text-xl md:text-2xl font-light lowercase items-center"
        style={{ x }}
      >
        {/* Triple duplication to ensure smooth wrap */}
        {[...stackItems, ...stackItems, ...stackItems, ...stackItems].map(
          (item, index) => (
            <span key={`${item}-${index}`} className="text-black select-none">
              {item}
            </span>
          )
        )}
      </motion.div>
    </div>
  )
}
