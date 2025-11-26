'use client'

import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import Image from 'next/image'

export const stackImages = [
  { name: 'nextjs', src: '/img/next.png' },
  { name: 'tailwind / scss', src: '/img/tailwind.png' },
  { name: 'framer-motion', src: '/img/framer.png' },
  { name: 'typescript / go', src: '/img/ts.png' },
  { name: 'supabase / pgsql', src: '/img/supabase.png' },
  { name: 'zustand', src: '/img/zustand.png' },
  { name: 'docker', src: '/img/docker.png' },
  { name: 'nginx', src: '/img/nginx.png' },
  { name: 'prisma', src: '/img/redis.png' }, // Assuming prisma uses redis icon for now or needs update
  { name: 'redis', src: '/img/redis.png' },
  { name: 'kafka', src: '/img/kafka.png' },
  { name: 'jest', src: '/img/jest.png' },
  { name: 'sentry', src: '/img/sentry.png' },
  { name: 'hztech', src: '/img/next.png' },
  { name: 'zod + react hook form', src: '/img/zod.png' },
  { name: 'eslint', src: '/img/eslint.png' },
  { name: 'husky + lint-staged', src: '/img/husky.png' },
  { name: 'next-intl', src: '/img/next-intl.png' },
  { name: 'tanstack query', src: '/img/tanstack.png' },
]

// Separate definition to map composite names to multiple physical bodies if needed
// Actually, we spawn bodies based on this list.
// If "supabase / pgsql" is ONE item in the list, it spawns ONE ball (supabase.png).
// If the user wants TWO balls (one supabase, one pgsql), we need to split them in the physical spawning list,
// but keep them grouped in the UI list.

// SOLUTION: We will split the spawn list into individual atoms, but keep the UI list as composite.
// We need a mapping.

const physicalItems = [
  { name: 'nextjs', src: '/img/next.png' },
  { name: 'tailwind', src: '/img/tailwind.png' },
  { name: 'scss', src: '/img/scss.png' },
  { name: 'framer-motion', src: '/img/framer.png' },
  { name: 'typescript', src: '/img/ts.png' },
  { name: 'go', src: '/img/go.png' },
  { name: 'supabase', src: '/img/supabase.png' },
  { name: 'pgsql', src: '/img/pgsql.png' },
  { name: 'zustand', src: '/img/zustand.png' },
  { name: 'docker', src: '/img/docker.png' },
  { name: 'nginx', src: '/img/nginx.png' },
  { name: 'prisma', src: '/img/redis.png' }, // Todo: fix icon
  { name: 'redis', src: '/img/redis.png' },
  { name: 'kafka', src: '/img/kafka.png' },
  { name: 'jest', src: '/img/jest.png' },
  { name: 'sentry', src: '/img/sentry.png' },
  { name: 'hztech', src: '/img/next.png' },
  { name: 'zod', src: '/img/zod.png' },
  { name: 'react hook form', src: '/img/HookForm.png' },
  { name: 'eslint', src: '/img/eslint.png' },
  { name: 'husky', src: '/img/husky.png' },
  { name: 'lint-staged', src: '/img/lint-staged.png' },
  { name: 'next-intl', src: '/img/next-intl.png' },
  { name: 'tanstack query', src: '/img/tanstack.png' },
]

interface StackPhysicsProps {
  hoveredItem?: string | null
}

export function StackPhysics({ hoveredItem }: StackPhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const bodiesRef = useRef<Matter.Body[]>([])

  const hoveredItemRef = useRef<string | null>(null)
  useEffect(() => {
    hoveredItemRef.current = hoveredItem || null
  }, [hoveredItem])

  const [items, setItems] = useState<
    {
      id: number
      x: number
      y: number
      angle: number
      src: string
      name: string
    }[]
  >([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)
    updateDimensions()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const engine = Matter.Engine.create()
    engineRef.current = engine
    const world = engine.world

    engine.gravity.y = 0
    const gravityTimeout = setTimeout(() => {
      engine.gravity.y = 1
    }, 2000)

    const { width, height } = dimensions
    const wallThickness = 100

    const walls = [
      Matter.Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        0 - wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 2,
        { isStatic: true }
      ),
    ]
    Matter.Composite.add(world, walls)

    // SPAWN: Use physicalItems list to ensure pgsql and supabase exist separately
    const iconSize = 60
    const gap = 20
    const colWidth = iconSize + gap
    const cols = Math.max(1, Math.floor((width - 40) / colWidth))
    const startX = (width - cols * colWidth) / 2 + colWidth / 2
    const startY = 60

    const bodies = physicalItems.map((item, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      return Matter.Bodies.circle(
        startX + col * colWidth,
        startY + row * colWidth,
        30,
        {
          restitution: 0.5,
          friction: 0.1,
          frictionAir: 0.02,
          angle: 0,
          plugin: { src: item.src, name: item.name },
        }
      )
    })
    bodiesRef.current = bodies
    Matter.Composite.add(world, bodies)

    if (containerRef.current) {
      const mouse = Matter.Mouse.create(containerRef.current)
      // @ts-ignore
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      // @ts-ignore
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.1, render: { visible: false } },
      })
      Matter.Composite.add(world, mouseConstraint)

      Matter.Events.on(engine, 'beforeUpdate', () => {
        const hoveredName = hoveredItemRef.current
        const mousePos = mouse.position
        const repulsionRange = 100
        const repulsionForce = 0.05

        if (hoveredName) {
          // Split hovered name by '/' to handle "supabase / pgsql"
          const targets = hoveredName
            .split('/')
            .map((s) => s.trim().toLowerCase())

          // Find all matching bodies (exact match on sub-parts)
          const targetBodies = bodies.filter((b) =>
            targets.some((t) => b.plugin.name === t)
          )

          if (targetBodies.length > 0) {
            targetBodies.forEach((targetBody, index) => {
              Matter.Sleeping.set(targetBody, false)

              // Distribute multiple items around center
              const offset =
                targetBodies.length > 1
                  ? (index - (targetBodies.length - 1) / 2) * 80
                  : 0

              const centerX = width / 2 + offset
              const centerY = height / 2
              const dx = centerX - targetBody.position.x
              const dy = centerY - targetBody.position.y

              const strength = 0.002 * targetBody.mass
              Matter.Body.applyForce(targetBody, targetBody.position, {
                x: dx * strength,
                y: dy * strength,
              })

              Matter.Body.applyForce(targetBody, targetBody.position, {
                x: 0,
                y: -targetBody.mass * (engine.gravity.y * 0.001),
              })

              Matter.Body.setVelocity(targetBody, {
                x: targetBody.velocity.x * 0.8,
                y: targetBody.velocity.y * 0.8,
              })
              Matter.Body.setAngularVelocity(targetBody, 0)
              Matter.Body.setAngle(targetBody, 0)
            })
            return
          }
        }

        if (
          mousePos.x > 0 &&
          mousePos.x < width &&
          mousePos.y > 0 &&
          mousePos.y < height
        ) {
          bodies.forEach((body) => {
            // Don't repel if part of active selection
            if (hoveredName && hoveredName.includes(body.plugin.name)) return

            const dx = body.position.x - mousePos.x
            const dy = body.position.y - mousePos.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < repulsionRange) {
              const force = (1 - dist / repulsionRange) * repulsionForce
              Matter.Body.applyForce(body, body.position, {
                x: (dx / dist) * force,
                y: (dy / dist) * force,
              })
            }
          })
        }
      })
    }

    let animationId: number
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60)
      if (bodiesRef.current.length > 0) {
        setItems(
          bodiesRef.current.map((b) => ({
            id: b.id,
            x: b.position.x,
            y: b.position.y,
            angle: b.angle,
            src: b.plugin.src as string,
            name: b.plugin.name as string,
          }))
        )
      }
      animationId = requestAnimationFrame(loop)
    }
    const initialRaf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(initialRaf)
      cancelAnimationFrame(animationId)
      clearTimeout(gravityTimeout)
      Matter.Engine.clear(engine)
    }
  }, [dimensions])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] relative overflow-hidden bg-white"
    >
      {items.map((item) => {
        // Enhanced Match Logic for Rendering
        let isMatch = false
        if (hoveredItem) {
          const targets = hoveredItem.split('/').map((s) => s.trim())
          isMatch = targets.some((t) => t === item.name)
        }
        const isDimmed = hoveredItem ? !isMatch : false
        const isHighlighted = isMatch

        return (
          <div
            key={item.id}
            className={`absolute w-16 h-16 flex items-center justify-center select-none pointer-events-none transition-all duration-300 ease-out ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'} ${isHighlighted ? 'z-50 drop-shadow-2xl' : ''}`}
            style={{
              transform: `translate(${item.x - 32}px, ${item.y - 32}px) rotate(${item.angle}rad)`,
              willChange: 'transform',
              zIndex: isHighlighted ? 50 : 10,
            }}
          >
            <Image
              src={item.src}
              alt="icon"
              width={60}
              height={60}
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        )
      })}
    </div>
  )
}
