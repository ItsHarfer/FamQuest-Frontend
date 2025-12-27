'use client'

import React from 'react'
import Link from 'next/link'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Mist Effect Background */}
      <div className="absolute inset-0 bg-mist-gradient mist-effect opacity-30"></div>
      
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
        
          <Typography variant="display" as="h1"> 
          <Image src="/images/logo.png" alt="FamQuest Logo" width={300} height={300} className="mx-auto" />
            FamQuest
          </Typography>
          <Typography variant="body" className="text-xl text-soft-cyan max-w-2xl mx-auto">
            Transform the mundane chaos of household management into a shared, cooperative epic adventure.
          </Typography>
        </div>

        {/* Main CTA Card */}
        <Card variant="elevated" className="max-w-md mx-auto">
          <div className="space-y-6">
            <Typography variant="heading" as="h2" className="text-2xl">
              The Portal Awaits
            </Typography>
            <Typography variant="body" className="text-gray-300">
              Enter the realm where families unite to defeat entropy. The Guild Master beckons.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Enter the Realm
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Begin Your Quest
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <div className="text-4xl mb-4">⚔️</div>
            <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
              Cooperative Boss Battles
            </Typography>
            <Typography variant="caption">
              Unite your family to face monthly challenges
            </Typography>
          </Card>
          <Card>
            <div className="text-4xl mb-4">📜</div>
            <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
              Quest Board
            </Typography>
            <Typography variant="caption">
              Transform tasks into epic quests
            </Typography>
          </Card>
          <Card>
            <div className="text-4xl mb-4">🎭</div>
            <Typography variant="body" className="font-semibold text-ancient-gold mb-2">
              AI Guild Master
            </Typography>
            <Typography variant="caption">
              Your wise mentor guides the journey
            </Typography>
          </Card>
        </div>
      </div>
    </div>
  )
}

