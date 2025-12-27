'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Login über n8n
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || data.message || 'The mists have clouded the connection. Please check your credentials.')
        return
      }

      // Store token in localStorage for now (can be improved with httpOnly cookies later)
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        if (data.expiresAt) {
          localStorage.setItem('auth_token_expires', data.expiresAt)
        }
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
          <Image src="/images/logo.png" alt="FamQuest Logo" width={300} height={300} className="mx-auto" />
            <Typography variant="display" as="h1" className="text-4xl mb-2">
              FamQuest
            </Typography>
          </Link>
          <Typography variant="body" className="text-soft-cyan">
            The mists of productivity beckon, Strategist.
          </Typography>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Typography variant="heading" as="h2" className="text-2xl mb-2">
                Enter the Realm
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Return to your quest, hero.
              </Typography>
            </div>

            {error && (
              <div className="p-3 bg-danger-rune bg-opacity-20 border border-danger-rune rounded-lg">
                <Typography variant="caption" className="text-danger-rune">
                  {error}
                </Typography>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entering...' : 'Enter the Realm'}
            </Button>

            <div className="text-center">
              <Typography variant="caption" className="text-gray-400">
                New to the realm?{' '}
                <Link href="/register" className="text-ancient-gold hover:underline">
                  Begin your quest
                </Link>
              </Typography>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

