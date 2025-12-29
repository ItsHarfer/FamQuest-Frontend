'use client'

import React, { useEffect, useState, useRef } from 'react'
import { User } from '@/types'
import { PREPARATION_STAGES } from '@/lib/constants'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'

interface AvatarDisplayProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  xpGained?: number // XP gained from completed quest
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  user,
  size = 'md',
  xpGained,
}) => {
  const [displayXP, setDisplayXP] = useState(user.xp_current)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showXPGain, setShowXPGain] = useState(false)
  const previousXPRef = useRef(user.xp_current)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stageName = PREPARATION_STAGES[user.stage as keyof typeof PREPARATION_STAGES] || 'Plain Clothes'
  
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  }

  // Animate XP change when it increases
  useEffect(() => {
    const currentXP = user.xp_current
    const previousXP = previousXPRef.current

    // If xpGained is provided, trigger animation immediately
    if (xpGained && xpGained > 0) {
      // Show XP gain animation
      setShowXPGain(true)
      setIsAnimating(true)

      // Animate XP counter from previous to current
      const startXP = previousXP
      const endXP = currentXP
      const difference = endXP - startXP
      const duration = 1000 // 1 second
      const steps = 30
      const stepValue = difference / steps
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const newValue = Math.min(
          startXP + stepValue * currentStep,
          endXP
        )
        setDisplayXP(Math.floor(newValue))

        if (currentStep >= steps) {
          clearInterval(interval)
          setDisplayXP(endXP)
        }
      }, stepDuration)

      // Hide XP gain text after animation
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      animationTimeoutRef.current = setTimeout(() => {
        setShowXPGain(false)
        setIsAnimating(false)
      }, 2000)

      previousXPRef.current = currentXP
    } else if (currentXP !== previousXP) {
      // Just update without animation if XP changed but no gain specified
      setDisplayXP(currentXP)
      previousXPRef.current = currentXP
    } else {
      // Keep display in sync
      setDisplayXP(currentXP)
    }
  }, [user.xp_current, xpGained])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

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
    <div className="flex flex-col items-center space-y-4 relative">
      <div
        className={`${sizes[size]} rounded-full bg-deep-teal border-2 border-ancient-gold flex items-center justify-center ${getGlowClass()} transition-all duration-300 ${
          isAnimating ? 'scale-110' : ''
        }`}
      >
        <span>{getAvatarEmoji()}</span>
      </div>
      
      <div className="text-center relative">
        <Typography variant="body" className="font-semibold text-white">
          {user.name}
        </Typography>
        <Typography variant="caption" className="text-soft-cyan">
          {stageName}
        </Typography>
        <div className="mt-2 relative">
          <Typography 
            variant="caption" 
            className={`text-ancient-gold transition-all duration-300 ${
              isAnimating ? 'scale-110 font-bold' : ''
            }`}
          >
            {displayXP.toLocaleString()} XP
          </Typography>
          
          {/* XP Gain Animation */}
          {showXPGain && xpGained && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-xp-gain pointer-events-none">
              <Typography
                variant="caption"
                className="text-success-glow font-bold text-lg drop-shadow-lg"
              >
                +{xpGained} XP
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

