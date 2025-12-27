'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChatBubble } from './ChatBubble'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ChatMessage } from '@/types'

interface ChatInterfaceProps {
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => Promise<void>
  isStreaming?: boolean
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  isStreaming = false,
}) => {
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && onSendMessage && !isSending) {
      setIsSending(true)
      try {
        await onSendMessage(input.trim())
        setInput('')
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setIsSending(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-midnight rounded-lg overflow-hidden">
      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-soft-cyan">
              <p className="font-serif text-xl mb-2">The mists of productivity beckon, Strategist.</p>
              <p className="font-sans text-sm">What task shall we commune with today?</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {(isStreaming || isSending) && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-arcane-violet flex items-center justify-center glow-violet">
              <span className="text-white text-sm font-serif">GM</span>
            </div>
            <div className="flex-1 bg-deep-teal rounded-lg p-4">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-soft-cyan rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-soft-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-soft-cyan rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-deep-teal">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak to the Guild Master..."
            className="flex-1"
            disabled={isStreaming || isSending}
          />
          <Button type="submit" disabled={isStreaming || isSending || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

