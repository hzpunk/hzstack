import type { ChatThread } from './types'

export type ChatThreadItemProps = {
  thread: ChatThread
  selected: boolean
  onSelect: () => void
}

export function ChatThreadItem({ thread, selected, onSelect }: ChatThreadItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        selected
          ? 'w-full h-[76px] border-b border-brand-black/20 bg-brand-blue text-white flex items-center'
          : 'w-full h-[76px] border-b border-brand-black/20 bg-white text-brand-black flex items-center hover:bg-brand-black/[0.03]'
      }
    >
      <div className="pl-3 pr-3 flex items-center gap-3 w-full">
        <div
          aria-hidden
          className={
            selected
              ? 'h-12 w-12 bg-white/20 border border-white/40'
              : 'h-12 w-12 bg-brand-black/5 border border-brand-black/20'
          }
        />

        <div className="flex flex-col items-start gap-1 min-w-0">
          <div
            className={
              selected
                ? 'font-cygre text-[12px] leading-none text-white truncate'
                : 'font-cygre text-[12px] leading-none text-brand-black truncate'
            }
          >
            {thread.name}
          </div>
          <div
            className={
              selected
                ? 'font-cygre text-[10px] leading-none text-white/80 truncate'
                : 'font-cygre text-[10px] leading-none text-brand-grey truncate'
            }
          >
            {thread.lastMessage}
          </div>
        </div>
      </div>
    </button>
  )
}
