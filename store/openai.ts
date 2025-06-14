import create from 'zustand'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OpenAIState {
  messages: Message[]
  sendMessage: (text: string) => Promise<void>
}

export const useOpenAIStore = create<OpenAIState>((set, get) => ({
  messages: [],
  sendMessage: async (text) => {
    set({ messages: [...get().messages, { role: 'user', content: text }] })

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...get().messages, { role: 'user', content: text }],
      }),
    })

    const data = await res.json()
    const reply = data.choices[0].message.content

    set({ messages: [...get().messages, { role: 'assistant', content: reply }] })
  },
}))
