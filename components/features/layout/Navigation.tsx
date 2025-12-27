'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export const Navigation: React.FC = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/spellbook', label: 'Spellbook' },
  ]

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-deep-teal border-b border-warm-copper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            
            <Typography variant="heading" as="h1" className="text-2xl">
              FamQuest
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-ancient-gold bg-opacity-20 text-ancient-gold border border-ancient-gold'
                    : 'text-gray-300 hover:text-ancient-gold hover:bg-deep-teal'
                }`}
              >
                <Typography variant="body" className="font-medium">
                  {item.label}
                </Typography>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ancient-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  isActive(item.href)
                    ? 'bg-ancient-gold bg-opacity-20 text-ancient-gold'
                    : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-4" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

