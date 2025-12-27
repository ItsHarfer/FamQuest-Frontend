'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Tabs } from '@/components/ui/Tabs'
import { ChatInterface } from '@/components/features/chat/ChatInterface'
import { QuestBoard } from '@/components/features/quests/QuestBoard'
import { BossBattle } from '@/components/features/boss/BossBattle'
import { AvatarDisplay } from '@/components/features/avatar/AvatarDisplay'
import { Header } from '@/components/features/layout/Header'
import { ChatMessage, Quest, User, Boss, BossProgress } from '@/types'
import Image from 'next/image'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [boss, setBoss] = useState<Boss | null>(null)
  const [bossProgress, setBossProgress] = useState<BossProgress | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const tabs = [
    { id: 'chat', label: 'Guild Master', icon: '💬' },
    { id: 'quests', label: 'Quest Board', icon: '📜' },
    { id: 'boss', label: 'Boss Battle', icon: '🐉' },
  ]

  // Fetch initial data
  useEffect(() => {
    if (session?.user) {
      fetchUserData()
      fetchQuests()
      fetchBossData()
      initializeChat()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: session?.user?.id,
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

  // Mock user data if not loaded
  const displayUser: User = user || {
    id: session?.user?.id || '1',
    name: session?.user?.name || 'Hero',
    email: session?.user?.email || '',
    role: 'Member',
    stage: 1,
    xp_current: 250,
    family_id: '1',
  }

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <Header
          title="The Guild Hall"
          subtitle="The Guild Master awaits your command, Strategist."
        /> 
        <div className="hidden lg:block">
          <AvatarDisplay user={displayUser} size="md" />
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="fade-in">
        {activeTab === 'chat' && (
          <div className="h-[600px]">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
            />
          </div>
        )}

        {activeTab === 'quests' && (
          <QuestBoard quests={quests} />
        )}

        {activeTab === 'boss' && boss && bossProgress && (
          <BossBattle boss={boss} progress={bossProgress} />
        )}

        {activeTab === 'boss' && !boss && (
          <div className="text-center py-12">
            <p className="text-gray-400">No active boss battle. The Guild Master will announce the next challenge soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

