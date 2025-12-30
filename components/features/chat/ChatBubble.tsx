import React from 'react'
import { ChatMessage, MicroStep } from '@/types'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'

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
      <div className="flex-1 space-y-3">
        <div
          className={`rounded-lg p-4 ${
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

        {/* Quest Card if quest was created */}
        {message.questCreated && message.quest && (
          <Card variant="bordered" className="border-success-glow border-opacity-60 bg-deep-teal bg-opacity-50">
            <div className="space-y-3">
              {/* Quest Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-success-glow bg-opacity-20 text-success-glow font-semibold">
                      ✨ New Quest Created
                    </span>
                  </div>
                  <Typography variant="body" as="h3" className="font-semibold text-white mb-1">
                    {message.quest.title}
                  </Typography>
                </div>
              </div>

              {/* XP Display */}
              <div className="flex items-center space-x-2 pt-2 border-t border-deep-teal border-opacity-30">
                <span className="text-ancient-gold font-serif font-bold text-lg">
                  +{message.quest.xp_value}
                </span>
                <span className="text-gray-500 text-xs">XP</span>
              </div>

              {/* Microsteps Preview */}
              {message.microsteps_preview && message.microsteps_preview.length > 0 && (
                <div className="pt-3 border-t border-deep-teal border-opacity-30 space-y-2">
                  <Typography variant="caption" className="text-gray-400 font-semibold mb-2 block">
                    MicroSteps ({message.microsteps_preview.length})
                  </Typography>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {message.microsteps_preview
                      .sort((a: MicroStep, b: MicroStep) => a.order_index - b.order_index)
                      .map((step: MicroStep) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between p-2 rounded bg-deep-teal bg-opacity-20"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="text-sm text-gray-400">{step.order_index}.</span>
                            <Typography variant="caption" className="flex-1 text-gray-300">
                              {step.title}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            {step.estimated_minutes && (
                              <span>~{step.estimated_minutes}m</span>
                            )}
                            {step.xp_value > 0 && (
                              <span className="text-ancient-gold">+{step.xp_value} XP</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

