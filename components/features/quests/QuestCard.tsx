'use client'

import React, { useState } from 'react'
import { Quest, MicroStep } from '@/types'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'

interface QuestCardProps {
  quest: Quest
  isAvailable?: boolean
  isActive?: boolean
  onAccept?: (questId: string) => Promise<void>
  onToggleMicrostep?: (
    questId: string,
    microStepId: string,
    done: boolean
  ) => Promise<{
    ok: boolean
    code: number
    questId: string
    microstep: {
      id: string
      status: 'DONE' | 'OPEN' | 'SKIPPED'
      done: boolean
      updatedAt: string
    }
    open_steps: number
    total_steps: number
    questCompleted: boolean
    questStatus: string
  }>
  isAssigning?: boolean
}

const categoryColors: Record<string, { bg: string; text: string; icon?: string }> = {
  HOUSEHOLD: { bg: 'bg-warm-copper bg-opacity-20', text: 'text-warm-copper', icon: '🏠' },
  HEALTH: { bg: 'bg-success-glow bg-opacity-20', text: 'text-success-glow', icon: '💪' },
  LEARNING: { bg: 'bg-arcane-violet bg-opacity-20', text: 'text-arcane-violet', icon: '📚' },
  PERSONAL: { bg: 'bg-soft-cyan bg-opacity-20', text: 'text-soft-cyan', icon: '✨' },
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest: initialQuest,
  isAvailable = false,
  isActive = false,
  onAccept,
  onToggleMicrostep,
  isAssigning = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [quest, setQuest] = useState(initialQuest)
  const [togglingMicrosteps, setTogglingMicrosteps] = useState<Set<string>>(new Set())
  const categoryInfo = categoryColors[quest.category.toUpperCase()] || categoryColors.PERSONAL
  const totalSteps = quest.microSteps?.length || 0
  const doneSteps = quest.microSteps?.filter((step) => step.done || step.status === 'DONE').length || 0
  const progressPercentage = totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0
  const isCompleted = quest.status === 'COMPLETED'

  // Sort microSteps by order_index
  const sortedMicroSteps = [...(quest.microSteps || [])].sort(
    (a, b) => a.order_index - b.order_index
  )

  // Update quest when prop changes
  React.useEffect(() => {
    setQuest(initialQuest)
  }, [initialQuest])

  const handleAccept = async () => {
    if (onAccept && !isAssigning) {
      await onAccept(quest.id)
    }
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleMicrostepToggle = async (microStepId: string, currentDone: boolean) => {
    if (!onToggleMicrostep || togglingMicrosteps.has(microStepId) || isCompleted) {
      return
    }

    // Disable this microstep while toggling
    setTogglingMicrosteps((prev) => new Set(prev).add(microStepId))

    try {
      const response = await onToggleMicrostep(quest.id, microStepId, !currentDone)

      if (response.ok) {
        // Update microstep in local state
        setQuest((prevQuest) => {
          const updatedMicroSteps = prevQuest.microSteps?.map((step) =>
            step.id === microStepId
              ? {
                  ...step,
                  done: response.microstep.done,
                  status: response.microstep.status as 'OPEN' | 'DONE' | 'SKIPPED',
                }
              : step
          ) || []

          // Update quest status if completed
          const newStatus = response.questCompleted ? 'COMPLETED' : prevQuest.status

          return {
            ...prevQuest,
            microSteps: updatedMicroSteps,
            status: newStatus as any,
          }
        })
      }
    } catch (error) {
      console.error('Error toggling microstep:', error)
      // Optionally show error toast here
    } finally {
      setTogglingMicrosteps((prev) => {
        const next = new Set(prev)
        next.delete(microStepId)
        return next
      })
    }
  }

  const getMicrostepStatusIcon = (step: MicroStep) => {
    if (step.done || step.status === 'DONE') return '✅'
    if (step.status === 'SKIPPED') return '⏭️'
    return '⭕'
  }

  return (
    <Card
      variant="bordered"
      className={`transition-all duration-300 ${
        isCompleted
          ? 'border-success-glow hover:border-success-glow border-opacity-60'
          : isActive
          ? 'border-soft-cyan hover:border-soft-cyan border-opacity-60'
          : isAvailable
          ? 'border-warm-copper hover:border-ancient-gold border-opacity-40'
          : 'border-deep-teal border-opacity-40'
      }`}
    >
      <div className="space-y-4">
        {/* Header Row: Category + Quest Type Badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {categoryInfo.icon && <span className="text-lg">{categoryInfo.icon}</span>}
              <span className={`text-xs px-2 py-1 rounded ${categoryInfo.bg} ${categoryInfo.text} font-semibold`}>
                {quest.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-deep-teal text-gray-300 border border-deep-teal">
                {quest.quest_type === 'DAILY_RITUAL' ? 'Ritual' : 'Quest'}
              </span>
              {isCompleted && (
                <span className="text-xs px-2 py-0.5 rounded bg-success-glow bg-opacity-20 text-success-glow border border-success-glow font-semibold">
                  Completed
                </span>
              )}
              {quest.is_secret && <span className="text-arcane-violet text-sm">🔒</span>}
            </div>
            <Typography variant="body" as="h3" className="font-semibold text-white mb-1">
              {quest.title}
            </Typography>
            {quest.description && (
              <Typography 
                variant="caption" 
                className="text-gray-400 overflow-hidden text-ellipsis"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {quest.description}
              </Typography>
            )}
          </div>
        </div>

        {/* Progress Line: X / Y steps with progress bar */}
        {totalSteps > 0 && (
          <div className="space-y-2 pt-2 border-t border-deep-teal border-opacity-30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-soft-cyan font-semibold">
                {doneSteps} / {totalSteps} steps
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-deep-teal bg-opacity-30 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isCompleted ? 'bg-success-glow' : 'bg-soft-cyan'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* XP Line */}
        <div className="flex items-center justify-between pt-2 border-t border-deep-teal border-opacity-30">
          <div className="flex items-center space-x-2">
            <span className="text-ancient-gold font-serif font-bold text-lg">
              +{quest.xp_value}
            </span>
            {quest.bonus_xp > 0 && (
              <span className="text-success-glow text-xs font-semibold">
                (+{quest.bonus_xp} bonus)
              </span>
            )}
            <span className="text-gray-500 text-xs">XP</span>
          </div>
          {quest.due_date && (
            <span className="text-xs text-gray-500">
              Due: {new Date(quest.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isAvailable && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleAccept}
              disabled={isAssigning}
            >
              {isAssigning ? 'Accepting...' : 'Accept Quest'}
            </Button>
          )}
          {isActive && (
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleToggleExpand}
              disabled={isCompleted}
            >
              {isExpanded ? 'Hide Details' : 'Details'}
            </Button>
          )}
        </div>

        {/* MicroSteps Accordion */}
        {isActive && isExpanded && sortedMicroSteps.length > 0 && (
          <div className="pt-4 border-t border-deep-teal border-opacity-30 space-y-2">
            <Typography variant="caption" className="text-gray-400 font-semibold mb-2 block">
              MicroSteps
            </Typography>
            {sortedMicroSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-2 rounded bg-deep-teal bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <div className="flex items-center space-x-2 flex-1">
                  {isActive && onToggleMicrostep && !isCompleted ? (
                    <input
                      type="checkbox"
                      checked={step.done || step.status === 'DONE'}
                      onChange={() => handleMicrostepToggle(step.id, step.done || step.status === 'DONE')}
                      disabled={togglingMicrosteps.has(step.id)}
                      className="w-4 h-4 rounded border-deep-teal bg-midnight text-ancient-gold focus:ring-ancient-gold focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  ) : (
                    <span className="text-lg">{getMicrostepStatusIcon(step)}</span>
                  )}
                  <Typography 
                    variant="caption" 
                    className={`flex-1 ${
                      togglingMicrosteps.has(step.id) ? 'opacity-50' : 'text-white'
                    }`}
                  >
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
        )}
      </div>
    </Card>
  )
}

