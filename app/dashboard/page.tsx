'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs } from '@/components/ui/Tabs'
import { ChatInterface } from '@/components/features/chat/ChatInterface'
import { QuestBoard } from '@/components/features/quests/QuestBoard'
import { BossBattle } from '@/components/features/boss/BossBattle'
import { AvatarDisplay } from '@/components/features/avatar/AvatarDisplay'
import { Header } from '@/components/features/layout/Header'
import { ChatMessage, Quest, User, Boss, BossProgress } from '@/types'

export default function DashboardPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [boss, setBoss] = useState<Boss | null>(null)
  const [bossProgress, setBossProgress] = useState<BossProgress | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const tabs = [
    { id: 'chat', label: 'Guild Master', icon: '💬' },
    { id: 'quests', label: 'Quest Board', icon: '📜' },
    { id: 'boss', label: 'Boss Battle', icon: '🐉' },
  ]

  // ---------- AUTH GUARD (Cookie wird von Middleware geprüft, hier nur User-Daten laden) ----------
  useEffect(() => {
    const run = async () => {
      try {
        // Cookie wird automatisch mitgesendet (credentials: 'include' ist default für same-origin)
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Wichtig: Cookie wird mitgesendet
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok || !data?.ok || !data?.user) {
          // Middleware wird den User automatisch zu /login redirecten
          return
        }

        setUser(data.user as User)
        setAuthChecked(true)

        // After auth is confirmed, load initial data
        initializeChat()
        fetchQuests()
        fetchBossData()
      } catch (e) {
        // on any unexpected error -> middleware will handle redirect
        console.error('Auth check failed:', e)
      }
    }

    run()
  }, [router])

  // ---------- DATA LOADERS ----------
  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests')
      if (response.ok) {
        const data = await response.json()
        setQuests(data)
      }
    } catch (error) {
      console.error('Error fetching quests:', error)
    }
  }

  const fetchBossData = async () => {
    try {
      const response = await fetch('/api/boss')
      if (response.ok) {
        const data = await response.json()
        setBoss(data.boss)
        setBossProgress(data.progress)
      }
    } catch (error) {
      console.error('Error fetching boss data:', error)
    }
  }

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      content: 'The mists of productivity beckon, Strategist. What task shall we commune with today?',
      role: 'guild-master',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  // ---------- CHAT SEND ----------
  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsStreaming(true)

    try {
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userId: user?.id, // IMPORTANT: comes from /auth/me
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add guild master response
      const guildMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'The Guild Master acknowledges your request.',
        role: 'guild-master',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, guildMessage])

      if (data.questsUpdated) {
        fetchQuests()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'The mists have clouded the connection. Please try again.',
        role: 'guild-master',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsStreaming(false)
    }
  }

  // ---------- RENDER GUARD ----------
  if (!authChecked) {
    // Prevent flicker + avoids calling APIs while auth is not confirmed
    return null
  }

  // ---------- DISPLAY USER FALLBACK ----------
  const displayUser: User = user || {
    id: '1',
    name: 'Hero',
    email: '',
    role: 'Member',
    stage: 1,
    xp_current: 250,
    family_id: '1',
  }

  // ---------- UI ----------
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Header title="The Guild Hall" subtitle="The Guild Master awaits your command, Strategist." />
        <div className="hidden lg:block">
          <AvatarDisplay user={displayUser} size="md" />
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="fade-in">
        {activeTab === 'chat' && (
          <div className="h-[600px]">
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isStreaming={isStreaming} />
          </div>
        )}

        {activeTab === 'quests' && <QuestBoard quests={quests} />}

        {activeTab === 'boss' && boss && bossProgress && <BossBattle boss={boss} progress={bossProgress} />}

        {activeTab === 'boss' && !boss && (
          <div className="text-center py-12">
            <p className="text-gray-400">No active boss battle. The Guild Master will announce the next challenge soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}