'use client'

import { MoreHorizontal, Search } from 'lucide-react'

import type { ChatMessage, ChatThread } from './types'
import { ChatComposer } from './ChatComposer'

export type ChatWindowProps = {
  thread: ChatThread | null
  draft: string
  onDraftChange: (value: string) => void
  onSend: () => void
  messages: ChatMessage[]
}

export function ChatWindow({ thread, draft, onDraftChange, onSend, messages }: ChatWindowProps) {
  return (
    <section className="flex-1 min-w-0">
      <div className="w-full border border-brand-black/30 h-full flex flex-col">
        <div className="h-10 border-b border-brand-black/20 flex items-center justify-between px-4">
          <div className="flex flex-col">
            <div className="font-cygre text-[12px] leading-none text-brand-black">
              {thread?.name ?? ''}
            </div>
            <div className="font-cygre text-[10px] leading-none text-brand-blue">
              {thread?.status === 'online' ? 'в сети' : ''}
            </div>
          </div>

          <div className="flex items-center gap-3 text-brand-blue">
            <button type="button" aria-label="поиск" className="hover:opacity-70 transition-opacity">
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="меню" className="hover:opacity-70 transition-opacity">
              <MoreHorizontal size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[520px] bg-white" aria-label="сообщения">
          <div className="h-full w-full overflow-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="font-cygre text-[12px] text-brand-grey"> </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={m.sender === 'me' ? 'flex justify-end' : 'flex justify-start'}
                  >
                    <div
                      className={
                        m.sender === 'me'
                          ? 'max-w-[70%] border border-brand-black/20 px-3 py-2 font-cygre text-[12px] text-brand-black'
                          : 'max-w-[70%] border border-brand-black/20 px-3 py-2 font-cygre text-[12px] text-brand-black'
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ChatComposer value={draft} onChange={onDraftChange} onSend={onSend} />
      </div>
    </section>
  )
}
