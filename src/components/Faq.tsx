'use client'

import { useId, useMemo, useState } from 'react'

import { Minus, Plus } from 'lucide-react'

type FaqItem = {
  question: string
  answer: string
}

const items: FaqItem[] = [
  {
    question: 'как строится система платы?',
    answer:
      'вы платите фиксированную стоимость подписки. все деньги за занятия остаются у вас — платформа комиссию не берет.',
  },
  {
    question: 'что если студент не пришел?',
    answer:
      'условия отмены и возврата зависят от договоренности сторон. при спорных случаях можно подать апелляцию на рассмотрение.',
  },
  {
    question: 'можно ли сменить тариф?',
    answer:
      'да, тариф можно изменить в любое время. новый тариф начнет действовать со следующего платежного периода.',
  },
  {
    question: 'как работает безопасность?',
    answer:
      'предоплата может быть заморожена до завершения сделки, а при нарушениях условий доступна апелляция и разбор ситуации.',
  },
]

export function Faq() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number>(0)

  const resolvedItems = useMemo(() => items, [])

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1120px] px-8 py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[240px_1fr]">
          <div className="font-cygre text-[64px] leading-none text-brand-black">faq</div>

          <div className="w-full">
            {resolvedItems.map((item, idx) => {
              const isOpen = openIndex === idx
              const buttonId = `${baseId}-q-${idx}`
              const panelId = `${baseId}-a-${idx}`

              return (
                <div
                  key={item.question}
                  className={idx === 0 ? 'border-t border-brand-black/30' : ''}
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full py-8 flex items-center justify-between gap-6 border-b border-brand-black/30 text-left"
                  >
                    <span className="font-cygre text-[20px] leading-none text-brand-black tracking-[-0.02em]">
                      {item.question}
                    </span>
                    <span className="text-brand-black">
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.5} />
                      ) : (
                        <Plus size={16} strokeWidth={1.5} />
                      )}
                    </span>
                  </button>

                  {isOpen ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="pb-8 font-cygre text-[14px] leading-[22px] text-brand-black"
                    >
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
