import { useEffect, useMemo, useRef, useState } from 'react'
import { BroadcastChannelPubSubClient } from '../../../lib/pubsub/BroadcastChannelPubSubClient'
import { WebSocketPubSubClient } from '../../../lib/pubsub/WebSocketPubSubClient'
import type { ChatEvent, ChatMessage } from '../types'

const CHANNEL_NAME = 'demo-v1-pubsub:chat'
const TRANSPORT = (import.meta.env.VITE_PUBSUB_TRANSPORT ?? 'local') as
  | 'local'
  | 'ws'
const WS_URL = (import.meta.env.VITE_WS_URL ??
  'wss://echo.websocket.org') as string

function uuid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useChat() {
  const [author, setAuthor] = useState('Sanjay')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const client = useMemo(
    () =>
      TRANSPORT === 'ws'
        ? new WebSocketPubSubClient<ChatEvent>(WS_URL)
        : new BroadcastChannelPubSubClient<ChatEvent>(),
    [],
  )
  const authorRef = useRef(author)
  authorRef.current = author

  useEffect(() => {
    client.connect({ channel: CHANNEL_NAME })
    const unsubscribe = client.subscribe((event) => {
      if (event.type === 'message:new') {
        setMessages((prev) => [...prev, event.message])
      }
    })

    // tiny presence ping (demo only)
    client.publish({ type: 'presence:ping', author, sentAt: Date.now() })

    return () => {
      unsubscribe()
      client.disconnect()
    }
  }, [client, author])

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const message: ChatMessage = {
      id: uuid(),
      author: authorRef.current,
      text: trimmed,
      sentAt: Date.now(),
    }

    client.publish({ type: 'message:new', message })
    // Optimistic append for the current tab (BroadcastChannel also echoes in many browsers, but not all).
    setMessages((prev) => [...prev, message])
  }

  return {
    author,
    setAuthor,
    messages,
    sendMessage,
  }
}

