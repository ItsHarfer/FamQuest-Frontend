import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-sans font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight'
  
  const variants = {
    primary: 'bg-ancient-gold text-midnight hover:bg-opacity-90 focus:ring-ancient-gold glow-gold',
    secondary: 'bg-warm-copper text-white hover:bg-opacity-90 focus:ring-warm-copper',
    ghost: 'bg-transparent text-soft-cyan hover:bg-deep-teal focus:ring-soft-cyan border border-deep-teal',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

