'use client'

import { Paperclip, Send } from 'lucide-react'

export type ChatComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

export function ChatComposer({ value, onChange, onSend }: ChatComposerProps) {
  return (
    <div className="h-12 border-t border-brand-black/20 flex items-center">
      <button
        type="button"
        aria-label="прикрепить"
        className="h-full w-12 flex items-center justify-center text-brand-grey hover:text-brand-black transition-colors"
      >
        <Paperclip size={18} strokeWidth={1.5} />
      </button>

      <input
        aria-label="написать сообщение"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="напишите сообщение..."
        className="flex-1 h-full bg-transparent font-cygre text-[12px] leading-none text-brand-black outline-none placeholder:text-brand-grey"
      />

      <button
        type="button"
        aria-label="отправить"
        onClick={onSend}
        className="h-full w-12 flex items-center justify-center text-brand-grey hover:text-brand-blue transition-colors"
      >
        <Send size={18} strokeWidth={1.5} />
      </button>
    </div>
  )
}
