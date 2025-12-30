'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Typography } from './Typography'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  count,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-success-glow border-opacity-40 rounded-lg overflow-hidden bg-deep-teal bg-opacity-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-deep-teal hover:bg-opacity-20 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <span className={cn(
            'text-success-glow transform transition-transform duration-300 text-sm',
            isOpen ? 'rotate-90' : ''
          )}>
            ▶
          </span>
          <Typography variant="heading" as="h3" className="text-success-glow">
            {title}
          </Typography>
          {count !== undefined && (
            <span className="text-gray-400 text-sm">({count})</span>
          )}
        </div>
        <span className="text-success-glow text-sm">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

