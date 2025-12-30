'use client'

import React, { useState, useMemo } from 'react'
import { QuestCard } from './QuestCard'
import { Quest } from '@/types'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type SortOption = 'xp_desc' | 'xp_asc' | 'category' | 'title' | 'date' | 'progress'
type FilterOption = 'all' | string

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
  
  // Sort and filter states for Active Quests
  const [activeSort, setActiveSort] = useState<SortOption>('xp_desc')
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  
  // Sort and filter states for Available Quests
  const [availableSort, setAvailableSort] = useState<SortOption>('xp_desc')
  const [availableFilter, setAvailableFilter] = useState<FilterOption>('all')

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

  // Get unique categories for filtering
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    activeQuests.forEach((q) => categories.add(q.category))
    availableQuests.forEach((q) => categories.add(q.category))
    return Array.from(categories).sort()
  }, [activeQuests, availableQuests])

  // Sort function
  const sortQuests = (quests: Quest[], sortOption: SortOption): Quest[] => {
    const sorted = [...quests]
    
    switch (sortOption) {
      case 'xp_desc':
        return sorted.sort((a, b) => {
          const totalA = a.xp_value + (a.bonus_xp || 0)
          const totalB = b.xp_value + (b.bonus_xp || 0)
          return totalB - totalA
        })
      case 'xp_asc':
        return sorted.sort((a, b) => {
          const totalA = a.xp_value + (a.bonus_xp || 0)
          const totalB = b.xp_value + (b.bonus_xp || 0)
          return totalA - totalB
        })
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category))
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'date':
        return sorted.sort((a, b) => {
          const dateA = a.due_date ? new Date(a.due_date).getTime() : 0
          const dateB = b.due_date ? new Date(b.due_date).getTime() : 0
          return dateA - dateB
        })
      case 'progress':
        return sorted.sort((a, b) => {
          const progressA = a.microSteps?.filter((ms) => ms.done || ms.status === 'DONE').length || 0
          const totalA = a.microSteps?.length || 1
          const progressB = b.microSteps?.filter((ms) => ms.done || ms.status === 'DONE').length || 0
          const totalB = b.microSteps?.length || 1
          const ratioA = progressA / totalA
          const ratioB = progressB / totalB
          return ratioB - ratioA
        })
      default:
        return sorted
    }
  }

  // Filter function
  const filterQuests = (quests: Quest[], filterOption: FilterOption): Quest[] => {
    if (filterOption === 'all') return quests
    return quests.filter((q) => q.category === filterOption)
  }

  // Process Active Quests
  const processedActiveQuests = useMemo(() => {
    const filtered = filterQuests(activeQuests, activeFilter)
    return sortQuests(filtered, activeSort)
  }, [activeQuests, activeFilter, activeSort])

  // Process Available Quests
  const processedAvailableQuests = useMemo(() => {
    const filtered = filterQuests(availableQuests, availableFilter)
    return sortQuests(filtered, availableSort)
  }, [availableQuests, availableFilter, availableSort])

  // Sort Completed Quests by completion date (most recent first)
  const sortedCompletedQuests = useMemo(() => {
    return [...completedQuests].sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0
      return dateB - dateA
    })
  }, [completedQuests])

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Typography variant="heading" as="h3" className="text-soft-cyan">
              Active Quests
            </Typography>
            {counts && (
              <span className="text-gray-400 text-sm">({counts.active})</span>
            )}
          </div>
          
          {/* Filter and Sort Controls */}
          {activeQuests.length > 0 && (
            <div className="flex items-center space-x-2">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-3 py-1.5 bg-deep-teal border border-warm-copper rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-ancient-gold"
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-deep-teal border border-warm-copper rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-ancient-gold"
              >
                <option value="xp_desc">XP: High to Low</option>
                <option value="xp_asc">XP: Low to High</option>
                <option value="progress">Progress</option>
                <option value="category">Category</option>
                <option value="title">Title (A-Z)</option>
                <option value="date">Due Date</option>
              </select>
            </div>
          )}
        </div>

        {processedActiveQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedActiveQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isActive={true}
                onToggleMicrostep={onToggleMicrostep}
              />
            ))}
          </div>
        ) : activeQuests.length > 0 ? (
          <Card variant="bordered" className="border-deep-teal border-opacity-40">
            <div className="text-center py-6">
              <Typography variant="body" className="text-gray-400">
                No active quests match the selected filter.
              </Typography>
            </div>
          </Card>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Typography variant="heading" as="h3" className="text-warm-copper">
              Available Quests
            </Typography>
            {counts && (
              <span className="text-gray-400 text-sm">({counts.available})</span>
            )}
          </div>
          
          {/* Filter and Sort Controls */}
          {availableQuests.length > 0 && (
            <div className="flex items-center space-x-2">
              <select
                value={availableFilter}
                onChange={(e) => setAvailableFilter(e.target.value)}
                className="px-3 py-1.5 bg-deep-teal border border-warm-copper rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-ancient-gold"
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={availableSort}
                onChange={(e) => setAvailableSort(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-deep-teal border border-warm-copper rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-ancient-gold"
              >
                <option value="xp_desc">XP: High to Low</option>
                <option value="xp_asc">XP: Low to High</option>
                <option value="category">Category</option>
                <option value="title">Title (A-Z)</option>
                <option value="date">Due Date</option>
              </select>
            </div>
          )}
        </div>

        {processedAvailableQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedAvailableQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isAvailable={true}
                onAccept={handleAcceptQuest}
                isAssigning={assigningQuestId === quest.id}
              />
            ))}
          </div>
        ) : availableQuests.length > 0 ? (
          <Card variant="bordered" className="border-deep-teal border-opacity-40">
            <div className="text-center py-6">
              <Typography variant="body" className="text-gray-400">
                No available quests match the selected filter.
              </Typography>
            </div>
          </Card>
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

      {/* Completed Quests Section - Accordion */}
      {completedQuests.length > 0 && (
        <Accordion
          title="Completed Quests"
          count={completedQuests.length}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCompletedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isActive={false}
              />
            ))}
          </div>
        </Accordion>
      )}
    </div>
  )
}

