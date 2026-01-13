import type { PubSubClient, Unsubscribe } from './PubSubClient'

type AnyRecord = Record<string, unknown>

function safeJsonParse(value: string | null): unknown {
  if (!value) return null
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function uuid(): string {
  // crypto.randomUUID is supported in modern browsers; fallback keeps demo working everywhere.
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * Local Pub/Sub implementation for demos:
 * - Uses BroadcastChannel when available (best UX)
 * - Falls back to localStorage events for cross-tab messaging
 */
export class BroadcastChannelPubSubClient<TEvent extends AnyRecord>
  implements PubSubClient<TEvent>
{
  private bc: BroadcastChannel | null = null
  private subscribers = new Set<(event: TEvent) => void>()
  private storageKey: string | null = null
  private onStorage: ((e: StorageEvent) => void) | null = null

  connect(opts: { channel: string }) {
    this.disconnect()

    this.storageKey = `pubsub:${opts.channel}`

    if (typeof BroadcastChannel !== 'undefined') {
      this.bc = new BroadcastChannel(opts.channel)
      this.bc.onmessage = (e: MessageEvent) => {
        const event = e.data as TEvent
        this.emit(event)
      }
      return
    }

    // Fallback: cross-tab publish via localStorage + "storage" event.
    this.onStorage = (e: StorageEvent) => {
      if (!this.storageKey) return
      if (e.key !== this.storageKey) return
      const parsed = safeJsonParse(e.newValue)
      if (!parsed || typeof parsed !== 'object') return
      this.emit(parsed as TEvent)
    }
    window.addEventListener('storage', this.onStorage)
  }

  disconnect() {
    if (this.bc) {
      this.bc.close()
      this.bc = null
    }
    if (this.onStorage) {
      window.removeEventListener('storage', this.onStorage)
      this.onStorage = null
    }
    this.storageKey = null
  }

  publish(event: TEvent) {
    if (this.bc) {
      this.bc.postMessage(event)
      return
    }
    if (!this.storageKey) return

    // Make each publish trigger a storage event by changing the stored value.
    const envelope = { ...event, __nonce: uuid() }
    localStorage.setItem(this.storageKey, JSON.stringify(envelope))
  }

  subscribe(handler: (event: TEvent) => void): Unsubscribe {
    this.subscribers.add(handler)
    return () => this.subscribers.delete(handler)
  }

  private emit(event: TEvent) {
    for (const handler of this.subscribers) handler(event)
  }
}

