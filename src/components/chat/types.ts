export type ChatSender = 'me' | 'them'

export type ChatMessage = {
  id: string
  sender: ChatSender
  text: string
  createdAt: number
}

export type ChatThreadStatus = 'online' | 'offline'

export type ChatThread = {
  id: string
  name: string
  lastMessage: string
  status?: ChatThreadStatus
  avatarUrl?: string
  messages?: ChatMessage[]
}
