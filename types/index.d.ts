export type UserRole = 'Admin' | 'Parent' | 'Member' | 'Child'

export type QuestStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'PENDING_VERIFICATION' 
  | 'COMPLETED' 
  | 'VOID'

export type VerificationType = 
  | 'SIMPLE' 
  | 'PHOTO_AI' 
  | 'PARENT_REVIEW'

export type QuestType = 'QUEST' | 'DAILY_RITUAL'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  stage: number // 0-3 (Current Preparation Stage)
  xp_current: number
  family_id: string
}

export interface MicroStep {
  id: string
  title: string
  status: 'OPEN' | 'DONE' | 'SKIPPED' | string
  done: boolean
  order_index: number
  estimated_minutes?: number | null
  xp_value: number
  createdAt: string
  updatedAt: string
}

export interface Quest {
  id: string
  title: string
  description?: string | null
  category: string // Household, Health, Learning
  status: QuestStatus
  verification_type: VerificationType
  proof_url?: string | null
  bonus_xp: number
  assigned_to?: string | null
  xp_value: number
  due_date?: string | null
  is_secret: boolean
  quest_type: QuestType // QUEST or DAILY_RITUAL
  family_id: string
  created_at: string
  updated_at: string
  microSteps: MicroStep[]
}

export interface Family {
  id: string
  name: string
  weekly_boss_hp: number
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'guild-master'
  timestamp: Date
  quest?: {
    id: string
    title: string
    xp_value: number
  }
  microsteps_preview?: MicroStep[]
  questCreated?: boolean
}

export interface Boss {
  id: string
  name: string
  theme: string
  description: string
  current_hp: number
  max_hp: number
  illustration_url?: string
  requirements: BossRequirement[]
  family_id: string
}

export interface BossRequirement {
  id: string
  description: string
  target_stage?: number
  target_quest_count?: number
  target_category?: string
  completed: boolean
  progress?: number
  max_progress?: number
}

export interface BossProgress {
  completed_stages: number[]
  completed_quests: number
  total_required_stages: number
  total_required_quests: number
  requirements: BossRequirement[]
}

