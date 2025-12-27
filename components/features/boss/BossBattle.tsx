'use client'

import React from 'react'
import { Boss, BossProgress } from '@/types'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'
import { PREPARATION_STAGES } from '@/lib/constants'

interface BossBattleProps {
  boss: Boss
  progress: BossProgress
}

export const BossBattle: React.FC<BossBattleProps> = ({ boss, progress }) => {
  const hpPercentage = (boss.current_hp / boss.max_hp) * 100

  return (
    <div className="space-y-8">
      {/* Boss Header */}
      <div className="text-center">
        <Typography variant="display" as="h1" className="mb-2">
          {boss.name}
        </Typography>
        <Typography variant="body" className="text-soft-cyan text-lg">
          {boss.theme}
        </Typography>
      </div>

      {/* Boss Illustration */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-arcane-violet via-midnight to-deep-teal flex items-center justify-center relative">
          {boss.illustration_url ? (
            <img
              src={boss.illustration_url}
              alt={boss.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center">
              <div className="text-9xl mb-4">🐉</div>
              <Typography variant="body" className="text-gray-400">
                {boss.description}
              </Typography>
            </div>
          )}
          {/* HP Bar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-midnight bg-opacity-80 p-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="body" className="text-warning-ember font-semibold">
                Boss HP
              </Typography>
              <Typography variant="body" className="text-white font-bold">
                {boss.current_hp} / {boss.max_hp}
              </Typography>
            </div>
            <div className="w-full bg-deep-teal rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-danger-rune to-warning-ember transition-all duration-500 glow-ember"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Typography variant="heading" as="h3" className="text-xl mb-4">
            Preparation Status
          </Typography>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="body" className="text-soft-cyan">
                  Completed Stages
                </Typography>
                <Typography variant="body" className="text-success-glow font-bold">
                  {progress.completed_stages.length} / {progress.total_required_stages}
                </Typography>
              </div>
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((stage) => (
                  <div
                    key={stage}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center ${
                      progress.completed_stages.includes(stage)
                        ? 'bg-success-glow bg-opacity-20 border border-success-glow glow-success'
                        : 'bg-deep-teal border border-warm-copper'
                    }`}
                  >
                    <span className="text-xs text-center">
                      {PREPARATION_STAGES[stage as keyof typeof PREPARATION_STAGES]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="body" className="text-soft-cyan">
                  Completed Quests
                </Typography>
                <Typography variant="body" className="text-success-glow font-bold">
                  {progress.completed_quests} / {progress.total_required_quests}
                </Typography>
              </div>
              <div className="w-full bg-deep-teal rounded-full h-3">
                <div
                  className="h-full bg-success-glow transition-all duration-500 glow-success"
                  style={{
                    width: `${(progress.completed_quests / progress.total_required_quests) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <Typography variant="heading" as="h3" className="text-xl mb-4">
            Requirements
          </Typography>
          <div className="space-y-3">
            {boss.requirements.map((requirement) => (
              <div
                key={requirement.id}
                className={`p-3 rounded-lg border ${
                  requirement.completed
                    ? 'bg-success-glow bg-opacity-10 border-success-glow'
                    : 'bg-deep-teal border-warm-copper'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Typography variant="body" className="text-sm">
                    {requirement.description}
                  </Typography>
                  {requirement.completed ? (
                    <span className="text-success-glow text-xl">✓</span>
                  ) : (
                    <span className="text-warning-ember text-xl">○</span>
                  )}
                </div>
                {requirement.progress !== undefined && requirement.max_progress !== undefined && (
                  <div className="mt-2 w-full bg-deep-teal rounded-full h-2">
                    <div
                      className="h-full bg-soft-cyan transition-all duration-500"
                      style={{
                        width: `${(requirement.progress / requirement.max_progress) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Battle Info */}
      <Card variant="bordered" className="border-arcane-violet">
        <Typography variant="body" className="text-center text-soft-cyan">
          {boss.description}
        </Typography>
      </Card>
    </div>
  )
}

