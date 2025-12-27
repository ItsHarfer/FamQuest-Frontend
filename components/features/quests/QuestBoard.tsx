'use client'

import React from 'react'
import { QuestItem } from './QuestItem'
import { Quest } from '@/types'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'

interface QuestBoardProps {
  quests: Quest[]
  onQuestClick?: (quest: Quest) => void
}

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  onQuestClick,
}) => {
  const dailyRituals = quests.filter((q) => q.quest_type === 'DAILY_RITUAL')
  const regularQuests = quests.filter((q) => q.quest_type === 'QUEST')
  
  const openQuests = regularQuests.filter((q) => q.status === 'OPEN' || q.status === 'ASSIGNED')
  const completedQuests = regularQuests.filter((q) => q.status === 'COMPLETED')
  const pendingQuests = regularQuests.filter((q) => q.status === 'PENDING_VERIFICATION')

  const openRituals = dailyRituals.filter((q) => q.status === 'OPEN' || q.status === 'ASSIGNED')
  const completedRituals = dailyRituals.filter((q) => q.status === 'COMPLETED')

  return (
    <div className="space-y-6">
      <Typography variant="heading" as="h2">
        Quest Board
      </Typography>

      {/* Daily Rituals Section */}
      {dailyRituals.length > 0 && (
        <div>
          <Typography variant="body" className="text-arcane-violet mb-3 font-semibold flex items-center">
            <span className="mr-2">✨</span>
            Daily Rituals
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openRituals.map((ritual) => (
              <QuestItem
                key={ritual.id}
                quest={ritual}
                onClick={() => onQuestClick?.(ritual)}
                isRitual={true}
              />
            ))}
            {completedRituals.slice(0, 3).map((ritual) => (
              <QuestItem
                key={ritual.id}
                quest={ritual}
                onClick={() => onQuestClick?.(ritual)}
                isRitual={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Quests */}
      {openQuests.length > 0 && (
        <div>
          <Typography variant="body" className="text-soft-cyan mb-3 font-semibold">
            Active Quests
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openQuests.map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onClick={() => onQuestClick?.(quest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Verification */}
      {pendingQuests.length > 0 && (
        <div>
          <Typography variant="body" className="text-warning-ember mb-3 font-semibold">
            Awaiting Verification
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingQuests.map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onClick={() => onQuestClick?.(quest)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <Typography variant="body" className="text-success-glow mb-3 font-semibold">
            Completed Quests
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedQuests.slice(0, 6).map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onClick={() => onQuestClick?.(quest)}
              />
            ))}
          </div>
        </div>
      )}

      {quests.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <Typography variant="body" className="text-gray-400">
              The Quest Board is empty. The Guild Master awaits your command.
            </Typography>
          </div>
        </Card>
      )}
    </div>
  )
}

