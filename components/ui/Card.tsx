import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered'
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-deep-teal',
    elevated: 'bg-deep-teal shadow-lg',
    bordered: 'bg-deep-teal border border-warm-copper',
  }
  
  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

