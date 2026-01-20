export function CatalogTopBar() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-8 pt-4 pb-6">
        <div className="flex items-start justify-between gap-10">
          <h1 className="font-cygre font-normal text-brand-black text-[64px] leading-none">
            репетиторы
          </h1>

          <div className="flex items-start gap-12 pt-4">
            <button
              type="button"
              className="flex items-center gap-2 font-cygre text-[10px] leading-none text-brand-black"
            >
              <span>фильтры</span>
              <svg
                aria-hidden
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-1">
              <div className="font-cygre text-[10px] leading-none text-brand-black">
                сортировать по:
              </div>
              <button
                type="button"
                className="flex items-center gap-2 font-cygre text-[10px] leading-none text-brand-grey"
              >
                <span>популярности</span>
                <svg
                  aria-hidden
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-cygre text-[10px] leading-none text-brand-black">
                цена за час
              </div>
              <div className="flex items-center gap-4">
                <input
                  aria-label="цена за час"
                  className="catalog-range w-[170px]"
                  type="range"
                  min={0}
                  max={2000}
                  defaultValue={800}
                />
                <div className="flex items-center gap-2">
                  <input
                    aria-label="значение цены"
                    className="h-4 w-9 border border-brand-black/40 bg-white px-1 font-cygre text-[10px] leading-none text-brand-black outline-none"
                    type="text"
                    inputMode="numeric"
                    defaultValue="800"
                  />
                  <span className="font-cygre text-[10px] leading-none text-brand-black">
                    р
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-cygre text-[10px] leading-none text-brand-black">
                опыт
              </div>
              <div className="flex items-center gap-4">
                <input
                  aria-label="опыт"
                  className="catalog-range w-[170px]"
                  type="range"
                  min={0}
                  max={30}
                  defaultValue={5}
                />
                <div className="flex items-center gap-2">
                  <input
                    aria-label="значение опыта"
                    className="h-4 w-9 border border-brand-black/40 bg-white px-1 font-cygre text-[10px] leading-none text-brand-black outline-none"
                    type="text"
                    inputMode="numeric"
                    defaultValue="5"
                  />
                  <span className="font-cygre text-[10px] leading-none text-brand-black">
                    + лет
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
