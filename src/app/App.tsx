import { ChatPage } from '../features/chat/ChatPage'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Hello from Sanjay
          </h1>
          <p className="mt-3 text-slate-300">Something else</p>
        </header>

        <section className="mt-10">
          <ChatPage />
        </section>
      </div>
    </main>
  )
}

