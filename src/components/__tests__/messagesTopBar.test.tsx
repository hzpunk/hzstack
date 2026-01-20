import { fireEvent, render, screen } from '@testing-library/react'

import { MessagesTopBar } from '../MessagesTopBar'

const backMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}))

describe('MessagesTopBar', () => {
  it('renders title and back button', () => {
    render(<MessagesTopBar />)

    expect(screen.getByRole('button', { name: 'назад' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'сообщения' })).toBeInTheDocument()
  })

  it('calls router.back on click', () => {
    render(<MessagesTopBar />)

    fireEvent.click(screen.getByRole('button', { name: 'назад' }))
    expect(backMock).toHaveBeenCalledTimes(1)
  })
})
