import type { ChatMessage } from '../types'

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageList(props: {
  messages: ChatMessage[]
  me: string
}) {
  const { messages, me } = props

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-slate-300">
        No messages yet. Open this app in a second tab and send a message.
      </div>
    )
  }

  return (
    <ol className="space-y-3">
      {messages.map((m) => {
        const isMe = m.author.trim().toLowerCase() === me.trim().toLowerCase()
        return (
          <li key={m.id} className={isMe ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={[
                'max-w-[85%] rounded-2xl border px-4 py-3',
                isMe
                  ? 'border-indigo-500/40 bg-indigo-500/15'
                  : 'border-slate-800 bg-slate-900/40',
              ].join(' ')}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-semibold text-slate-100">
                  {m.author}
                </span>
                <span className="text-xs text-slate-400">{formatTime(m.sentAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-slate-200">
                {m.text}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

