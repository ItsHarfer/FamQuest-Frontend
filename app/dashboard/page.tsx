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
import { apiFetch } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([])
  const [activeQuests, setActiveQuests] = useState<Quest[]>([])
  const [questCounts, setQuestCounts] = useState<{
    available: number
    active: number
    total: number
  } | null>(null)
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

        const u = data.user as User
        setUser(u)
        setAuthChecked(true)

        initializeChat()
        fetchQuests(u.id)  
        fetchBossData()
      } catch (e) {
        // on any unexpected error -> middleware will handle redirect
        console.error('Auth check failed:', e)
      }
    }

    run()
  }, [router])

  // ---------- DATA LOADERS ----------
  const fetchUserData = async () => {
    try {
      const data = await apiFetch<User>('/api/user')
      setUser(data)
    } catch (e) {
      console.error('Error fetching user data:', e)
    }
  }
  
  const fetchQuests = async (userId?: string) => {
    try {
      const uid = userId ?? user?.id
      if (!uid) return
  
      const data = await apiFetch<{
        ok?: boolean
        availableQuests?: Quest[]
        activeQuests?: Quest[]
        counts?: {
          available: number
          active: number
          total: number
        }
      }>(`/api/quests?userId=${encodeURIComponent(uid)}`)
  
      // Handle new API response structure
      if (data?.ok && data.availableQuests && data.activeQuests) {
        setAvailableQuests(data.availableQuests)
        setActiveQuests(data.activeQuests)
        if (data.counts) {
          setQuestCounts(data.counts)
        }
      } else if (Array.isArray(data)) {
        // Fallback: if API returns array, split by assigned_to
        const available = (data as Quest[]).filter((q) => !q.assigned_to)
        const active = (data as Quest[]).filter((q) => q.assigned_to === uid)
        setAvailableQuests(available)
        setActiveQuests(active)
        setQuestCounts({
          available: available.length,
          active: active.length,
          total: (data as Quest[]).length,
        })
      } else {
        setAvailableQuests([])
        setActiveQuests([])
        setQuestCounts(null)
      }
    } catch (e) {
      console.error('Error fetching quests:', e)
      setAvailableQuests([])
      setActiveQuests([])
    }
  }
  
  const fetchBossData = async () => {
    try {
      const data = await apiFetch<{ boss: Boss; progress: BossProgress }>('/api/boss')
      setBoss(data.boss)
      setBossProgress(data.progress)
    } catch (e) {
      console.error('Error fetching boss data:', e)
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
    if (!user?.id) {
      throw new Error('Not authenticated (missing user id)')
    }

    const data = await apiFetch<{ message?: string; questsUpdated?: boolean }>(
      '/api/orchestrator',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          userId: user.id, // IMPORTANT: comes from /api/auth/me -> /api/user
        }),
      }
    )

    // Add guild master response
    const guildMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: data.message || 'The Guild Master acknowledges your request.',
      role: 'guild-master',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, guildMessage])

    // Refresh quests if they were updated
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

        {activeTab === 'quests' && (
          <QuestBoard
            availableQuests={availableQuests}
            activeQuests={activeQuests}
            counts={questCounts || undefined}
            onAcceptQuest={async (questId: string) => {
              try {
                const response = await fetch('/api/quests/assign', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                  body: JSON.stringify({ questId }),
                })

                const data = await response.json()

                if (!response.ok) {
                  let errorMessage = 'Failed to accept quest'
                  if (data.code === 'QUEST_NOT_AVAILABLE') {
                    errorMessage = 'This quest is no longer available'
                  } else if (data.code === 'NOT_ALLOWED') {
                    errorMessage = 'You are not allowed to assign this quest'
                  } else if (data.code === 'NOT_FOUND') {
                    errorMessage = 'Quest not found'
                  } else if (data.error) {
                    errorMessage = data.error
                  }
                  throw new Error(errorMessage)
                }

                // Refresh quests after successful assignment
                if (user?.id) {
                  await fetchQuests(user.id)
                }
              } catch (err) {
                console.error('Error accepting quest:', err)
                throw err
              }
            }}
            onToggleMicrostep={async (questId: string, microStepId: string, done: boolean) => {
              if (!user?.id) {
                throw new Error('User not authenticated')
              }

              const { toggleMicrostep } = await import('@/lib/api')
              const response = await toggleMicrostep(user.id, questId, microStepId)

              // Update local state optimistically
              setActiveQuests((prev) =>
                prev.map((q) => {
                  if (q.id !== questId) return q

                  const updatedMicroSteps = q.microSteps?.map((ms) =>
                    ms.id === microStepId
                      ? {
                          ...ms,
                          done: response.microstep.done,
                          status: response.microstep.status as 'OPEN' | 'DONE' | 'SKIPPED',
                        }
                      : ms
                  ) || []

                  return {
                    ...q,
                    microSteps: updatedMicroSteps,
                    status: response.questCompleted ? ('COMPLETED' as any) : q.status,
                  }
                })
              )

              // If quest completed, show notification and refresh
              if (response.questCompleted) {
                // Show toast notification (you can add a toast library later)
                console.log('Quest completed!', questId)
                
                // Refresh quests to get updated state from server
                if (user.id) {
                  await fetchQuests(user.id)
                }
              }

              return response
            }}
          />
        )}

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