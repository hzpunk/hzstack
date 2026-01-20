'use client'

import { useCallback, useMemo, useState } from 'react'

import type { ChatMessage, ChatThread } from './types'
import { ChatSidebar } from './ChatSidebar'
import { ChatWindow } from './ChatWindow'

export type ChatPanelProps = {
  threads: ChatThread[]
  initialThreadId?: string
  onSendMessage?: (threadId: string, text: string) => void
  onSelectThread?: (threadId: string) => void
}

export function ChatPanel({ threads, initialThreadId, onSendMessage, onSelectThread }: ChatPanelProps) {
  const [search, setSearch] = useState('')

  const initialSelectedId = useMemo(() => {
    if (initialThreadId && threads.some((t) => t.id === initialThreadId)) return initialThreadId
    return threads[0]?.id ?? null
  }, [initialThreadId, threads])

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialSelectedId)

  const [draft, setDraft] = useState('')

  const initialMessagesByThread = useMemo(() => {
    const map: Record<string, ChatMessage[]> = {}
    for (const t of threads) {
      map[t.id] = t.messages ?? []
    }
    return map
  }, [threads])

  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>(
    initialMessagesByThread
  )

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return threads
    return threads.filter((t) => {
      const hay = `${t.name} ${t.lastMessage}`.toLowerCase()
      return hay.includes(q)
    })
  }, [search, threads])

  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null
    return threads.find((t) => t.id === selectedThreadId) ?? null
  }, [selectedThreadId, threads])

  const selectedMessages = useMemo(() => {
    if (!selectedThreadId) return []
    return messagesByThread[selectedThreadId] ?? []
  }, [messagesByThread, selectedThreadId])

  const handleSelectThread = useCallback(
    (id: string) => {
      setSelectedThreadId(id)
      onSelectThread?.(id)
    },
    [onSelectThread]
  )

  const handleSend = useCallback(() => {
    const text = draft.trim()
    if (!text) return
    if (!selectedThreadId) return

    const message: ChatMessage = {
      id: String(Date.now()),
      sender: 'me',
      text,
      createdAt: Date.now(),
    }

    setMessagesByThread((prev) => ({
      ...prev,
      [selectedThreadId]: [...(prev[selectedThreadId] ?? []), message],
    }))

    setDraft('')
    onSendMessage?.(selectedThreadId, text)
  }, [draft, onSendMessage, selectedThreadId])

  return (
    <div className="w-full flex gap-6">
      <ChatSidebar
        threads={filteredThreads}
        selectedThreadId={selectedThreadId}
        searchValue={search}
        onSearchChange={setSearch}
        onSelectThread={handleSelectThread}
      />

      <ChatWindow
        thread={selectedThread}
        messages={selectedMessages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
      />
    </div>
  )
}
