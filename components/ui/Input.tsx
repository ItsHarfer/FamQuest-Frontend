import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-soft-cyan mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 bg-deep-teal border border-warm-copper rounded-lg',
          'text-white placeholder-gray-500 focus:outline-none focus:ring-2',
          'focus:ring-ancient-gold focus:border-ancient-gold transition-all duration-300',
          error && 'border-danger-rune focus:ring-danger-rune',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger-rune">{error}</p>
      )}
    </div>
  )
}

