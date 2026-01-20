import { render, screen } from '@testing-library/react'

import { CatalogTopBar } from '../CatalogTopBar'

describe('CatalogTopBar', () => {
  it('renders catalog top bar controls', () => {
    render(<CatalogTopBar />)

    expect(screen.getByRole('heading', { name: 'репетиторы' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /фильтры/i })).toBeInTheDocument()

    expect(screen.getByText('сортировать по:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /популярности/i })).toBeInTheDocument()

    expect(screen.getByText('цена за час')).toBeInTheDocument()
    expect(screen.getByLabelText('цена за час')).toBeInTheDocument()
    expect(screen.getByLabelText('значение цены')).toBeInTheDocument()

    expect(screen.getByText('опыт')).toBeInTheDocument()
    expect(screen.getByLabelText('опыт')).toBeInTheDocument()
    expect(screen.getByLabelText('значение опыта')).toBeInTheDocument()
  })
})
