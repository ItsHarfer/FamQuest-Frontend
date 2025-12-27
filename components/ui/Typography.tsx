import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  variant?: 'display' | 'heading' | 'body' | 'caption'
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as,
  variant = 'body',
}) => {
  const Component = as || (variant === 'body' ? 'p' : variant === 'display' ? 'h1' : 'h2')
  
  const variants = {
    display: 'font-serif text-4xl md:text-6xl font-black text-ancient-gold uppercase tracking-wide',
    heading: 'font-serif text-2xl md:text-4xl font-bold text-ancient-gold uppercase',
    body: 'font-sans text-base text-gray-200',
    caption: 'font-sans text-sm text-gray-400',
  }
  
  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  )
}

