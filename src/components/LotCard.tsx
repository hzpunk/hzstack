'use client'

import { useCallback, useMemo, useState } from 'react'
import { Heart } from 'lucide-react'

export type LotCardProps = {
  imageSrc: string
  name: string
  city: string
  experienceYears: number
  priceText: string
  onEnroll?: () => void
  defaultLiked?: boolean
  onLikeChange?: (liked: boolean) => void
}

export function LotCard({
  imageSrc,
  name,
  city,
  experienceYears,
  priceText,
  onEnroll,
  defaultLiked = false,
  onLikeChange,
}: LotCardProps) {
  const [liked, setLiked] = useState<boolean>(defaultLiked)

  const experienceLabel = useMemo(() => {
    const years = Math.max(0, Math.floor(experienceYears))
    return `${years} лет опыта`
  }, [experienceYears])

  const handleToggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev
      onLikeChange?.(next)
      return next
    })
  }, [onLikeChange])

  const handleEnroll = useCallback(() => {
    onEnroll?.()
  }, [onEnroll])

  return (
    <article className="w-full max-w-[593px] 2xl:w-[593px] bg-white border border-brand-black/60 flex flex-col 2xl:h-[651px]">
      <div className="w-full h-[280px] sm:h-[320px] 2xl:h-[330px] overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col px-8 pt-6 pb-6 flex-1">
        <div className="font-cygre font-normal text-brand-black text-[28px] sm:text-[32px] leading-none">
          {name}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-10 px-6 border border-brand-black/60 flex items-center justify-center font-cygre text-[16px] leading-none text-brand-black">
            {city}
          </div>
          <div className="h-10 px-6 border border-brand-black/60 flex items-center justify-center font-cygre text-[16px] leading-none text-brand-black">
            {experienceLabel}
          </div>
          <div className="h-10 px-6 border border-brand-black/60 flex items-center justify-center font-cygre text-[16px] leading-none text-brand-black">
            {priceText}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="w-full h-[54px] border border-brand-black/60 flex">
            <button
              type="button"
              onClick={handleEnroll}
              className="flex-1 h-full flex items-center justify-center font-cygre text-[16px] leading-none text-brand-black hover:bg-brand-black hover:text-white transition-colors"
            >
              записаться
            </button>

            <button
              type="button"
              aria-label="лайк"
              aria-pressed={liked}
              onClick={handleToggleLike}
              className="w-[54px] h-full border-l border-brand-black/60 flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-white transition-colors"
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                className={liked ? 'fill-current' : ''}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
