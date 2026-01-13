export type Unsubscribe = () => void

/**
 * Minimal Pub/Sub client contract.
 * Swap the implementation with PubNub (or any other provider) without changing UI code.
 */
export interface PubSubClient<TEvent> {
  connect: (opts: { channel: string }) => void
  disconnect: () => void
  publish: (event: TEvent) => void
  subscribe: (handler: (event: TEvent) => void) => Unsubscribe
}

