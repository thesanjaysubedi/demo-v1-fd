import { useEffect, useRef } from 'react'
import { MessageComposer } from './components/MessageComposer'
import { MessageList } from './components/MessageList'
import { useChat } from './hooks/useChat'

export function ChatPage() {
  const { author, setAuthor, messages, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  return (
    <div className="space-y-6">
      <MessageComposer
        author={author}
        onAuthorChange={setAuthor}
        onSend={sendMessage}
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">
            Messages ({messages.length})
          </h2>
          <span className="text-xs text-slate-400">Channel: demo-v1-pubsub:chat</span>
        </div>
        <div className="scrollbar-slate max-h-[420px] overflow-y-auto pr-1">
          <MessageList messages={messages} me={author} />
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}

