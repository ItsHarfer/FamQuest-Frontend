'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-deep-teal mb-6">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'px-6 py-4 font-sans font-medium text-sm transition-all duration-300',
              'border-b-2 focus:outline-none',
              tab.disabled
                ? 'border-transparent text-gray-600 cursor-not-allowed opacity-50'
                : activeTab === tab.id
                ? 'border-ancient-gold text-ancient-gold glow-gold'
                : 'border-transparent text-gray-400 hover:text-soft-cyan hover:border-soft-cyan'
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

