import type { PubSubClient, Unsubscribe } from './PubSubClient'

type AnyRecord = Record<string, unknown>

type Envelope<TEvent> = {
  channel: string
  event: TEvent
}

function isEnvelope<TEvent extends AnyRecord>(value: unknown): value is Envelope<TEvent> {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.channel === 'string' && typeof v.event === 'object' && v.event !== null
}

/**
 * WebSocket-based Pub/Sub adapter.
 *
 * NOTE: `wss://echo.websocket.org` is an "echo" endpoint: it returns your own message
 * back to the same client. It's useful to prove WebSocket integration, but it is not
 * a real multi-client broadcast Pub/Sub server.
 */
export class WebSocketPubSubClient<TEvent extends AnyRecord> implements PubSubClient<TEvent> {
  private ws: WebSocket | null = null
  private channel: string | null = null
  private subscribers = new Set<(event: TEvent) => void>()
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  connect(opts: { channel: string }) {
    this.disconnect()
    this.channel = opts.channel

    this.ws = new WebSocket(this.url)
    this.ws.onmessage = (e) => {
      const parsed = safeJsonParse(e.data)
      if (!isEnvelope<TEvent>(parsed)) return
      if (parsed.channel !== this.channel) return
      this.emit(parsed.event)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.channel = null
  }

  publish(event: TEvent) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    if (!this.channel) return

    const envelope: Envelope<TEvent> = { channel: this.channel, event }
    this.ws.send(JSON.stringify(envelope))
  }

  subscribe(handler: (event: TEvent) => void): Unsubscribe {
    this.subscribers.add(handler)
    return () => this.subscribers.delete(handler)
  }

  private emit(event: TEvent) {
    for (const handler of this.subscribers) handler(event)
  }
}

function safeJsonParse(value: unknown): unknown {
  if (typeof value !== 'string') return null
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

