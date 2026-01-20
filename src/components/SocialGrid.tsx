import type { ComponentType } from 'react'

type IconProps = {
  size?: number | string
  strokeWidth?: number | string
  className?: string
}

type SocialGridLink = {
  label: string
  href: string
  icon: ComponentType<IconProps>
}

interface SocialGridProps {
  links: SocialGridLink[]
}

export function SocialGrid({ links }: SocialGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {links.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 border border-brand-black/40 bg-white text-brand-black flex items-start justify-end p-3 hover:opacity-80 transition-opacity"
            aria-label={item.label}
          >
            <Icon size={22} strokeWidth={1.75} />
          </a>
        )
      })}
    </div>
  )
}
