'use client'

import React from 'react'
import { Quest } from '@/types'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'

interface QuestItemProps {
  quest: Quest
  onClick?: () => void
  isRitual?: boolean
}

export const QuestItem: React.FC<QuestItemProps> = ({ quest, onClick, isRitual = false }) => {
  const getStatusColor = () => {
    switch (quest.status) {
      case 'COMPLETED':
        return 'border-success-glow text-success-glow'
      case 'PENDING_VERIFICATION':
        return 'border-warning-ember text-warning-ember'
      case 'ASSIGNED':
        return 'border-soft-cyan text-soft-cyan'
      default:
        return 'border-warm-copper text-warm-copper'
    }
  }

  const getStatusText = () => {
    switch (quest.status) {
      case 'COMPLETED':
        return 'Victory!'
      case 'PENDING_VERIFICATION':
        return 'Awaiting Review'
      case 'ASSIGNED':
        return 'In Progress'
      default:
        return 'Available'
    }
  }

  return (
    <Card
      variant="bordered"
      className={`cursor-pointer hover:border-ancient-gold transition-all duration-300 ${getStatusColor()} ${isRitual ? 'border-arcane-violet' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {isRitual && <span className="text-arcane-violet text-lg">✨</span>}
            <Typography variant="body" as="h3" className="font-semibold text-white">
              {quest.title}
            </Typography>
          </div>
          {quest.is_secret && (
            <span className="text-xs text-arcane-violet">🔒</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{quest.category}</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-deep-teal">
          <div className="flex items-center space-x-2">
            <span className="text-ancient-gold font-serif font-bold">
              +{quest.xp_value}
            </span>
            {quest.bonus_xp > 0 && (
              <span className="text-success-glow text-xs">
                (+{quest.bonus_xp} bonus)
              </span>
            )}
          </div>
          {quest.due_date && (
            <span className="text-xs text-gray-500">
              {new Date(quest.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

