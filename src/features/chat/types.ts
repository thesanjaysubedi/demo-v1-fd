export type ChatMessage = {
  id: string
  author: string
  text: string
  sentAt: number // epoch ms
}

export type ChatEvent =
  | { type: 'message:new'; message: ChatMessage }
  | { type: 'presence:ping'; author: string; sentAt: number }

