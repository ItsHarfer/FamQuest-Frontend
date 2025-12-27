import React from 'react'
import { Navigation } from '@/components/features/layout/Navigation'

/**
 * Dashboard Layout
 * 
 * Hinweis: Authentifizierung wird später über n8n geregelt.
 * Session-Check wird dann hier implementiert.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Session-Check über n8n implementieren
  // const session = await checkSessionViaN8n()
  // if (!session) {
  //   redirect('/login')
  // }

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

