'use client'

import React from 'react'
import { Header } from '@/components/features/layout/Header'
import { Card } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'

export default function SpellbookPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Spellbook"
        subtitle="Your collection of tools and rituals, Strategist."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-4xl mb-4">📋</div>
          <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
            Quest Creator
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            Forge new quests for your family
          </Typography>
        </Card>

        <Card>
          <div className="text-4xl mb-4">📊</div>
          <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
            Family Stats
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            View your party's progress
          </Typography>
        </Card>

        <Card>
          <div className="text-4xl mb-4">⚙️</div>
          <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
            Settings
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            Configure your realm
          </Typography>
        </Card>
      </div>
    </div>
  )
}

