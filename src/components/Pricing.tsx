type Plan = {
  title: string
  price: string
  note: string
  items: string[]
  variant: 'default' | 'primary'
  badge?: string
}

const plans: Plan[] = [
  {
    title: 'старт',
    price: '0₽',
    note: '/месяц',
    items: [
      '1 активная анкета',
      'доступ к заявкам по 1 предмету',
      'система рейтингов и отзывов',
      'поддержка через чат',
    ],
    variant: 'default',
  },
  {
    title: 'профи',
    price: '499₽',
    note: '/месяц',
    badge: 'универсальный',
    items: [
      'до 2 анкет в разных предметах',
      'доступ к приоритетным заказам',
      'статистика просмотров и заявок',
    ],
    variant: 'primary',
  },
  {
    title: 'премиум',
    price: '999₽',
    note: '/месяц',
    items: [
      'неограниченное количество анкет',
      'продвижение в топе поиска',
      'особый статус в профиле',
    ],
    variant: 'default',
  },
]

export function Pricing() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1120px] px-8 py-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPrimary = plan.variant === 'primary'

            return (
              <div
                key={plan.title}
                className={
                  isPrimary
                    ? 'border border-brand-blue p-8 min-h-[440px] flex flex-col'
                    : 'border border-brand-black/40 p-8 min-h-[440px] flex flex-col'
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-cygre text-[14px] text-brand-black">
                    {plan.title}
                  </div>
                  {plan.badge ? (
                    <div className="h-5 px-2 bg-brand-blue text-white font-cygre text-[10px] flex items-center">
                      {plan.badge}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <div className="font-cygre font-normal text-brand-black text-[54px] leading-none">
                    {plan.price}
                  </div>
                  <div className="mb-1 font-cygre text-[12px] text-brand-black">
                    {plan.note}
                  </div>
                </div>

                <div className="mt-1 font-cygre text-[10px] text-brand-black">
                  {plan.title === 'старт'
                    ? 'идеально для начала'
                    : plan.title === 'профи'
                      ? 'дает расширенные возможности'
                      : 'максимум свободы и продвижения'}
                </div>

                <div className="mt-10 font-cygre text-[11px] text-brand-black">
                  {plan.title === 'профи'
                    ? 'все из стартового пакета:'
                    : 'все из пакета профи:'}
                </div>

                <ul className="mt-4 space-y-2 font-cygre text-[11px] leading-[16px] text-brand-black/70">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-[6px] h-1 w-1 rounded-full bg-brand-black/30"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={
                    isPrimary
                      ? 'mt-auto h-10 w-full bg-brand-blue text-white font-cygre text-[12px]'
                      : 'mt-auto h-10 w-full bg-brand-black text-white font-cygre text-[12px]'
                  }
                >
                  подключить тариф
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
