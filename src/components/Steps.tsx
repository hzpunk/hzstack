export function Steps() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1120px] px-8 py-28">
        <div className="md:hidden">
          <div className="flex flex-col gap-12">
            <div className="flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">1</div>
              <div className="mt-3 font-cygre text-[12px] leading-none text-brand-black">
                договоритесь о сделке
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">2</div>
              <div className="mt-2 max-w-[360px] font-cygre text-[12px] leading-[18px] text-brand-black">
                <div>внесите или получите предоплату</div>
                <div className="text-brand-grey">
                  предоплата замораживается
                  <br />
                  на аккаунте до завершения
                  <br />
                  сделки
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">3</div>
              <div className="mt-2 max-w-[380px] font-cygre text-[12px] leading-[18px] text-brand-black">
                <div>
                  заплатите за услугу в случае, если вас
                  <br />
                  всё устраивает или получите деньги
                </div>
                <div className="text-brand-grey">
                  при невыполнении условий сделки
                  <br />
                  можно подать апелляцию на
                  <br />
                  рассмотрение случая
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="relative h-[560px]">
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full text-brand-blue"
              viewBox="0 0 1120 560"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter
                  id="pencil-arrows"
                  x="-20%"
                  y="-40%"
                  width="140%"
                  height="180%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.65"
                    numOctaves="1"
                    seed="5"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="1.9"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              <g filter="url(#pencil-arrows)">
                <path
                  d="M240 110 C240 200 350 210 520 225 C700 240 760 250 840 275"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M241 112 C241 202 352 212 522 227 C702 242 762 252 842 277"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M820 250 L852 280 L815 290"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <path
                  d="M900 305 C980 360 980 430 870 455 C760 480 720 490 660 510"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M901 307 C981 362 981 432 871 457 C761 482 721 492 661 512"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M680 485 L650 515 L690 525"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            </svg>

            <div className="absolute left-[40px] top-[36px] flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">1</div>
              <div className="mt-3 font-cygre text-[12px] leading-none text-brand-black">
                договоритесь о сделке
              </div>
            </div>

            <div className="absolute right-[110px] top-[190px] flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">2</div>
              <div className="mt-2 max-w-[260px] font-cygre text-[12px] leading-[18px] text-brand-black">
                <div>внесите или получите предоплату</div>
                <div className="text-brand-grey">
                  предоплата замораживается
                  <br />
                  на аккаунте до завершения
                  <br />
                  сделки
                </div>
              </div>
            </div>

            <div className="absolute left-[170px] bottom-[46px] flex items-start gap-6">
              <div className="font-cygre text-[40px] leading-none text-brand-black">3</div>
              <div className="mt-2 max-w-[340px] font-cygre text-[12px] leading-[18px] text-brand-black">
                <div>
                  заплатите за услугу в случае, если вас
                  <br />
                  всё устраивает или получите деньги
                </div>
                <div className="text-brand-grey">
                  при невыполнении условий сделки
                  <br />
                  можно подать апелляцию на
                  <br />
                  рассмотрение случая
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
