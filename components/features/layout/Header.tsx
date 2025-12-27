'use client'

import React from 'react'
import { Typography } from '@/components/ui/Typography'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-8">
      <Typography variant="display" as="h1" className="mb-2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body" className="text-soft-cyan">
          {subtitle}
        </Typography>
      )}
    </header>
  )
}

