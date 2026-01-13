import { useEffect, useMemo, useState } from 'react'
import type { ChatMessage } from '../types'

type RelativeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'

function formatTimeAgo(opts: { sentAt: number; now: number; rtf: Intl.RelativeTimeFormat }) {
  const diffSeconds = Math.round((opts.sentAt - opts.now) / 1000) // negative for past
  const abs = Math.abs(diffSeconds)

  if (abs < 5) return 'just now'

  const table: Array<{ unit: RelativeUnit; seconds: number }> = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ]

  for (const { unit, seconds } of table) {
    if (abs >= seconds || unit === 'second') {
      const value = Math.trunc(diffSeconds / seconds)
      return opts.rtf.format(value, unit)
    }
  }

  return opts.rtf.format(diffSeconds, 'second')
}

export function MessageList(props: {
  messages: ChatMessage[]
  me: string
}) {
  const { messages, me } = props
  const [now, setNow] = useState(() => Date.now())
  const rtf = useMemo(() => new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }), [])

  // Keeps "x minutes ago" fresh while the user is looking at the chat.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

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
                <span className="text-xs text-slate-400">
                  {formatTimeAgo({ sentAt: m.sentAt, now, rtf })}
                </span>
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

