import { useState } from 'react'

export function MessageComposer(props: {
  author: string
  onAuthorChange: (next: string) => void
  onSend: (text: string) => void
}) {
  const { author, onAuthorChange, onSend } = props
  const [text, setText] = useState('')

  function submit() {
    const next = text
    setText('')
    onSend(next)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <div className="text-sm font-medium text-slate-200">Your name</div>
          <input
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            placeholder="Sanjay"
          />
        </label>

        <div className="flex-1">
          <div className="text-sm font-medium text-slate-200">Message</div>
          <div className="mt-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit()
                }
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Type and press Enter…"
            />
            <button
              type="button"
              onClick={submit}
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Tip: open this app in a second tab to see Pub/Sub in action.
          </p>
        </div>
      </div>
    </div>
  )
}

