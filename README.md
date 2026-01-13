## Demo: Hello from Sanjay + Pub/Sub Chat (Vite + React + Tailwind v3)

This repo is intentionally structured like a real frontend codebase:

- `src/app`: app shell / routing entry
- `src/features`: feature modules (ex: `features/chat`)
- `src/lib`: reusable libs (ex: `lib/pubsub`)

### Run locally

1) Install deps

```bash
npm install
```

2) Start dev server

```bash
npm run dev
```

### Pub/Sub chat demo

Open the app in **two browser tabs** and send messages. The demo uses a local Pub/Sub adapter:

- Interface: `src/lib/pubsub/PubSubClient.ts`
- Local impl: `src/lib/pubsub/BroadcastChannelPubSubClient.ts`
- WebSocket impl: `src/lib/pubsub/WebSocketPubSubClient.ts` (echo server)

To use PubNub later, you only need to implement the same `PubSubClient<ChatEvent>` interface and swap it in `features/chat/hooks/useChat.ts`.

### Notes

- Tailwind is set up using the classic **Tailwind CSS v3** config (`tailwind.config.cjs` + `postcss.config.cjs`).

### WebSocket mode (uses `wss://echo.websocket.org`)

Set Vite env vars:

```bash
VITE_PUBSUB_TRANSPORT=ws
VITE_WS_URL=wss://echo.websocket.org
```

Important: an **echo** websocket sends messages back to the same client only (it does not broadcast to other tabs/users). It’s mainly for demonstrating WebSocket integration.
