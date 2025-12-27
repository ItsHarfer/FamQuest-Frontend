import React from 'react'
import { ChatMessage } from '@/types'

interface ChatBubbleProps {
  message: ChatMessage
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isGuildMaster = message.role === 'guild-master'
  
  return (
    <div className={`flex items-start space-x-3 ${isGuildMaster ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isGuildMaster
            ? 'bg-arcane-violet glow-violet'
            : 'bg-ancient-gold'
        }`}
      >
        <span className={`text-sm font-serif ${isGuildMaster ? 'text-white' : 'text-midnight'}`}>
          {isGuildMaster ? 'GM' : 'You'}
        </span>
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 rounded-lg p-4 ${
          isGuildMaster
            ? 'bg-deep-teal text-gray-200'
            : 'bg-ancient-gold bg-opacity-20 text-ancient-gold border border-ancient-gold'
        }`}
      >
        <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

