'use client'

import { useState } from 'react'
import { StackPhysics, stackImages } from '@/components/StackPhysics'

export default function StackPage() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col md:flex-row w-full min-h-screen px-8 py-20 gap-10">
        {/* Main Content: Title + Physics */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <h1 className="typography-h1 lowercase whitespace-nowrap">
            наш стек:
          </h1>

          <div className="w-full bg-white rounded-xl border border-gray-100 relative overflow-hidden">
            <StackPhysics hoveredItem={hoveredTech} />
          </div>
        </div>

        {/* Right Column: Text List (Generated from physics data) */}
        {/* Added mt-16 to push it down to align with the white box, not the header */}
        <div className="md:w-1/4 flex flex-col gap-2 text-sm md:text-base text-gray-800 font-light lowercase md:mt-20">
          {stackImages.map((tech) => (
            <span
              key={tech.name}
              className={`cursor-pointer transition-colors duration-200 ${
                hoveredTech === tech.name
                  ? 'text-black font-medium scale-105 origin-left'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </main>
    </div>
  )
}
