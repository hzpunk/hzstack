import { MessagesTopBar } from '@/components/MessagesTopBar'
import { ChatPanel } from '@/components/chat/ChatPanel'

export default function MessagesPage() {
  const threads = [
    {
      id: 't-1',
      name: 'Артем Виноградов',
      lastMessage: 'спасибо',
      status: 'online' as const,
      messages: [
        { id: 'm-1', sender: 'them' as const, text: 'привет', createdAt: 1 },
        { id: 'm-2', sender: 'me' as const, text: 'спасибо', createdAt: 2 },
      ],
    },
    {
      id: 't-2',
      name: 'Артем Виноградов',
      lastMessage: 'спасибо',
      status: 'offline' as const,
      messages: [],
    },
    {
      id: 't-3',
      name: 'Артем Виноградов',
      lastMessage: 'спасибо',
      status: 'offline' as const,
      messages: [],
    },
  ]

  return (
    <main className="bg-white">
      <MessagesTopBar />

      <div className="px-8 pb-20">
        <ChatPanel threads={threads} />
      </div>
    </main>
  )
}
