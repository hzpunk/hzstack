import Link from 'next/link'

export function Hero() {
  return (
    <section className="w-full flex flex-col items-center text-center">
      <h1 className="font-cygre font-normal text-brand-black text-[52px] sm:text-[64px] leading-none tracking-[-0.04em]">
        hzrep.
      </h1>

      <p className="mt-6 max-w-[620px] text-[12px] leading-[18px] font-cygre">
        <span className="text-brand-grey">не очередная</span>{' '}
        <span className="text-brand-black">
          площадка для репетиторов, но с поддержкой криптовалют, глобальных пользователей
          и с безопасными платежами и защитой обеих сторон
        </span>
      </p>

      <Link
        href="/register"
        className="mt-10 relative inline-flex items-center justify-center h-7 px-5 bg-white text-[12px] leading-none font-cygre"
      >
        <span className="relative z-10 text-brand-black opacity-70">присоединиться</span>
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 28"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="pencil-border"
              x="-20%"
              y="-40%"
              width="140%"
              height="180%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.82"
                numOctaves="2"
                seed="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2.35"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g filter="url(#pencil-border)" className="text-brand-blue">
            <rect
              x="1"
              y="1"
              width="98"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              rx="2"
            />
            <rect
              x="1.4"
              y="1.6"
              width="97"
              height="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.38"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              rx="2"
            />
            <rect
              x="0.8"
              y="1.2"
              width="98.2"
              height="25.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.22"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              rx="2"
            />
          </g>
        </svg>
      </Link>
    </section>
  )
}
