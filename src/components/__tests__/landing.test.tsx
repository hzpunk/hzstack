import { fireEvent, render, screen } from '@testing-library/react'

import { Header } from '../Header'
import { Hero } from '../Hero'
import { Steps } from '../Steps'
import { Pricing } from '../Pricing'
import { Faq } from '../Faq'
import { Footer } from '../Footer'

describe('Landing layout', () => {
  it('renders header navigation, search and auth actions', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: 'главная' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'репетиторы' })).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: 'поиск' })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'войти' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'зарегистрироваться' })).toBeInTheDocument()
  })

  it('renders hero title, description and join action', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { name: 'hzrep.' })).toBeInTheDocument()
    expect(screen.getByText(/не очередная/i)).toBeInTheDocument()
    expect(screen.getByText(/площадка для репетиторов/i)).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'присоединиться' })).toBeInTheDocument()
  })

  it('renders steps content', () => {
    render(<Steps />)

    expect(screen.getAllByText('договоритесь о сделке').length).toBeGreaterThan(0)
    expect(
      screen.getAllByText('внесите или получите предоплату').length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/заплатите за услугу в случае, если вас/i).length
    ).toBeGreaterThan(0)
  })

  it('renders pricing cards', () => {
    render(<Pricing />)

    expect(screen.getByText('старт')).toBeInTheDocument()
    expect(screen.getByText('профи')).toBeInTheDocument()
    expect(screen.getByText('премиум')).toBeInTheDocument()

    expect(
      screen.getAllByRole('button', { name: 'подключить тариф' }).length
    ).toBe(3)
  })

  it('renders faq and toggles an item', () => {
    render(<Faq />)

    expect(screen.getByText('faq')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'как строится система платы?' })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /вы платите фиксированную стоимость подписки/i
      )
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'что если студент не пришел?' })
    )

    expect(
      screen.getByText(/условия отмены и возврата/i)
    ).toBeInTheDocument()
  })

  it('renders footer content', () => {
    render(<Footer />)

    expect(screen.getByText('hzcompanyteam@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('+79685462359')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'репетиторы' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'сообщения' })).toBeInTheDocument()

    expect(screen.getByText('designed by ivan peter')).toBeInTheDocument()
    expect(screen.getByText('© hzcompany 2025')).toBeInTheDocument()
    expect(screen.getByText('все права защищены')).toBeInTheDocument()

    expect(screen.getByText('hzcompany')).toBeInTheDocument()
  })
})
