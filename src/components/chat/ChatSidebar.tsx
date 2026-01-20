'use client'

import { Search } from 'lucide-react'

import type { ChatThread } from './types'
import { ChatThreadItem } from './ChatThreadItem'

export type ChatSidebarProps = {
  threads: ChatThread[]
  selectedThreadId: string | null
  searchValue: string
  onSearchChange: (value: string) => void
  onSelectThread: (id: string) => void
}

export function ChatSidebar({
  threads,
  selectedThreadId,
  searchValue,
  onSearchChange,
  onSelectThread,
}: ChatSidebarProps) {
  return (
    <aside className="w-[280px] shrink-0">
      <div className="w-full border border-brand-black/30">
        <div className="h-10 flex items-center gap-2 px-3 border-b border-brand-black/20">
          <Search size={14} strokeWidth={1.5} className="text-brand-grey" />
          <input
            aria-label="поиск по сообщениям"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="поиск по сообщениям"
            className="w-full h-full bg-transparent font-cygre text-[10px] leading-none text-brand-black outline-none placeholder:text-brand-grey"
          />
        </div>

        <div className="max-h-[680px] overflow-auto">
          {threads.length === 0 ? (
            <div className="p-4 font-cygre text-[12px] text-brand-grey">нет диалогов</div>
          ) : (
            threads.map((t) => (
              <ChatThreadItem
                key={t.id}
                thread={t}
                selected={t.id === selectedThreadId}
                onSelect={() => onSelectThread(t.id)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
