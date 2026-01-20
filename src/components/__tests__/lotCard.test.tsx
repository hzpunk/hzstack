import { fireEvent, render, screen } from '@testing-library/react'

import { LotCard } from '../LotCard'

describe('LotCard', () => {
  it('renders lot card content', () => {
    render(
      <LotCard
        imageSrc="/test.jpg"
        name="Седова Н. Н."
        city="москва"
        experienceYears={10}
        priceText="от 1900/ч"
      />
    )

    expect(screen.getByRole('img', { name: 'Седова Н. Н.' })).toBeInTheDocument()
    expect(screen.getByText('Седова Н. Н.')).toBeInTheDocument()

    expect(screen.getByText('москва')).toBeInTheDocument()
    expect(screen.getByText('10 лет опыта')).toBeInTheDocument()
    expect(screen.getByText('от 1900/ч')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'записаться' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'лайк' })).toBeInTheDocument()
  })

  it('calls callbacks and toggles like', () => {
    const onEnroll = jest.fn()
    const onLikeChange = jest.fn()

    render(
      <LotCard
        imageSrc="/test.jpg"
        name="Седова Н. Н."
        city="москва"
        experienceYears={10}
        priceText="от 1900/ч"
        onEnroll={onEnroll}
        onLikeChange={onLikeChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'записаться' }))
    expect(onEnroll).toHaveBeenCalledTimes(1)

    const likeButton = screen.getByRole('button', { name: 'лайк' })
    expect(likeButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(likeButton)
    expect(onLikeChange).toHaveBeenCalledWith(true)
    expect(likeButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(likeButton)
    expect(onLikeChange).toHaveBeenCalledWith(false)
    expect(likeButton).toHaveAttribute('aria-pressed', 'false')
  })
})
