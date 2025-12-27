'use client'

import React from 'react'
import { User } from '@/types'
import { PREPARATION_STAGES } from '@/lib/constants'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'

interface AvatarDisplayProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  user,
  size = 'md',
}) => {
  const stageName = PREPARATION_STAGES[user.stage as keyof typeof PREPARATION_STAGES] || 'Plain Clothes'
  
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  }

  const getGlowClass = () => {
    if (user.stage === 3) return 'glow-success'
    if (user.stage === 2) return 'glow-violet'
    if (user.stage === 1) return 'glow-gold'
    return ''
  }

  const getAvatarEmoji = () => {
    switch (user.stage) {
      case 3:
        return '⚔️' // Champion - Glowing Magical Armor
      case 2:
        return '🛡️' // Adept - Armor
      case 1:
        return '🎒' // Apprentice - Gear
      default:
        return '👤' // Plain Clothes
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`${sizes[size]} rounded-full bg-deep-teal border-2 border-ancient-gold flex items-center justify-center ${getGlowClass()} transition-all duration-300`}
      >
        <span>{getAvatarEmoji()}</span>
      </div>
      
      <div className="text-center">
        <Typography variant="body" className="font-semibold text-white">
          {user.name}
        </Typography>
        <Typography variant="caption" className="text-soft-cyan">
          {stageName}
        </Typography>
        <div className="mt-2">
          <Typography variant="caption" className="text-ancient-gold">
            {user.xp_current} XP
          </Typography>
        </div>
      </div>
    </div>
  )
}

