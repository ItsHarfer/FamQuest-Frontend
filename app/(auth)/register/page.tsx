'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        return
      }

      // Auto-login after registration
      router.push('/login?registered=true')
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
            Begin your epic journey, hero.
          </Typography>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Typography variant="heading" as="h2" className="text-2xl mb-2">
                Begin Your Quest
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Join the Guild and start your adventure.
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
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your hero name"
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your.email@example.com"
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Begin Your Quest'}
            </Button>

            <div className="text-center">
              <Typography variant="caption" className="text-gray-400">
                Already a member?{' '}
                <Link href="/login" className="text-ancient-gold hover:underline">
                  Enter the realm
                </Link>
              </Typography>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

