import { useEffect, useRef, useState } from 'react'
import { askJermukAI, type AIHistoryMessage } from '../lib/ai'
import type { SiteLanguageContent } from '../types'

interface ChatMessage extends AIHistoryMessage {
  id: string
}

function createMessage(role: 'user' | 'assistant', text: string): ChatMessage {
  return {
    id:
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
  }
}

export function AIWidget({ copy }: { copy: SiteLanguageContent }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage('assistant', copy.ai.welcome),
  ])
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    viewport.scrollTop = viewport.scrollHeight
  }, [messages, loading])

  const submitQuestion = async (question: string) => {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || loading) {
      return
    }

    const nextUserMessage = createMessage('user', trimmedQuestion)
    const nextHistory = [...messages, nextUserMessage].map<AIHistoryMessage>(({ role, text }) => ({
      role,
      text,
    }))

    setMessages((currentMessages) => [...currentMessages, nextUserMessage])
    setInput('')
    setLoading(true)

    const answer = await askJermukAI(trimmedQuestion, copy, nextHistory)

    setMessages((currentMessages) => [...currentMessages, createMessage('assistant', answer)])
    setLoading(false)
  }

  return (
    <div className={`ai-widget${open ? ' open' : ''}`}>
      {open ? (
        <section className="ai-panel" aria-label={copy.ai.title}>
          <header>
            <div>
              <strong>{copy.ai.title}</strong>
              <p>{copy.ai.description}</p>
            </div>

            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              ×
            </button>
          </header>

          <div ref={viewportRef} className="ai-messages">
            {messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <span>{message.role === 'assistant' ? copy.ai.title : 'You'}</span>
                <p>{message.text}</p>
              </article>
            ))}

            {loading ? (
              <article className="message assistant loading">
                <span>{copy.ai.title}</span>
                <p>...</p>
              </article>
            ) : null}
          </div>

          <div className="ai-prompt-list">
            {copy.ai.prompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void submitQuestion(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-form"
            onSubmit={(event) => {
              event.preventDefault()
              void submitQuestion(input)
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.ai.placeholder}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </section>
      ) : (
        <button type="button" className="ai-trigger" onClick={() => setOpen(true)}>
          <span className="status-dot" />
          <span>{copy.ai.title}</span>
        </button>
      )}
    </div>
  )
}
