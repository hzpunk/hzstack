import { fireEvent, render, screen } from '@testing-library/react'

import { ChatPanel } from '../chat/ChatPanel'

describe('ChatPanel', () => {
  it('renders threads and allows selecting a thread', () => {
    render(
      <ChatPanel
        threads={[
          {
            id: 't-1',
            name: 'Артем Виноградов',
            lastMessage: 'спасибо',
            status: 'online',
            messages: [],
          },
          {
            id: 't-2',
            name: 'Иван Петров',
            lastMessage: 'ок',
            status: 'offline',
            messages: [],
          },
        ]}
      />
    )

    expect(screen.getByLabelText('поиск по сообщениям')).toBeInTheDocument()

    expect(screen.getAllByText('Артем Виноградов').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Иван Петров').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByText('Иван Петров').closest('button') as HTMLElement)
    expect(screen.getAllByText('Иван Петров').length).toBeGreaterThan(0)
  })

  it('sends a message', () => {
    const onSendMessage = jest.fn()

    render(
      <ChatPanel
        onSendMessage={onSendMessage}
        threads={[
          {
            id: 't-1',
            name: 'Артем Виноградов',
            lastMessage: 'спасибо',
            status: 'online',
            messages: [],
          },
        ]}
      />
    )

    const input = screen.getByLabelText('написать сообщение')
    fireEvent.change(input, { target: { value: 'тест' } })

    fireEvent.click(screen.getByRole('button', { name: 'отправить' }))

    expect(onSendMessage).toHaveBeenCalledWith('t-1', 'тест')
    expect(screen.getByText('тест')).toBeInTheDocument()
  })
})
