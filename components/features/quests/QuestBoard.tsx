'use client'

import React, { useState } from 'react'
import { QuestCard } from './QuestCard'
import { Quest } from '@/types'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'

interface QuestBoardProps {
  availableQuests: Quest[]
  activeQuests: Quest[]
  completedQuests?: Quest[]
  onAcceptQuest: (questId: string) => Promise<void>
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
  counts?: {
    available: number
    active: number
    total: number
  }
}

export const QuestBoard: React.FC<QuestBoardProps> = ({
  availableQuests = [],
  activeQuests = [],
  completedQuests = [],
  onAcceptQuest,
  onToggleMicrostep,
  counts,
}) => {
  const [assigningQuestId, setAssigningQuestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAcceptQuest = async (questId: string) => {
    setAssigningQuestId(questId)
    setError(null)

    try {
      await onAcceptQuest(questId)
    } catch (err) {
      console.error('Error accepting quest:', err)
      setError('Failed to accept quest. Please try again.')
    } finally {
      setAssigningQuestId(null)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="px-4 py-2 bg-danger-rune bg-opacity-20 border border-danger-rune rounded-lg">
          <Typography variant="caption" className="text-danger-rune">
            {error}
          </Typography>
        </div>
      )}

      {/* Active Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Typography variant="heading" as="h3" className="text-soft-cyan">
            Active Quests
          </Typography>
          {counts && (
            <span className="text-gray-400 text-sm">({counts.active})</span>
          )}
        </div>

        {activeQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isActive={true}
                onToggleMicrostep={onToggleMicrostep}
              />
            ))}
          </div>
        ) : (
          <Card variant="bordered" className="border-deep-teal border-opacity-40">
            <div className="text-center py-6">
              <Typography variant="body" className="text-gray-400">
                No active quests. Accept one below.
              </Typography>
            </div>
          </Card>
        )}
      </div>

      {/* Available Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Typography variant="heading" as="h3" className="text-warm-copper">
            Available Quests
          </Typography>
          {counts && (
            <span className="text-gray-400 text-sm">({counts.available})</span>
          )}
        </div>

        {availableQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isAvailable={true}
                onAccept={handleAcceptQuest}
                isAssigning={assigningQuestId === quest.id}
              />
            ))}
          </div>
        ) : (
          <Card variant="bordered" className="border-deep-teal border-opacity-40">
            <div className="text-center py-6">
              <Typography variant="body" className="text-gray-400">
                No available quests right now.
              </Typography>
            </div>
          </Card>
        )}
      </div>

      {/* Completed Quests Section */}
      {completedQuests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Typography variant="heading" as="h3" className="text-success-glow">
              Completed Quests
            </Typography>
            <span className="text-gray-400 text-sm">({completedQuests.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

