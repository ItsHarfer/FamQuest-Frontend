'use client'

export default function Providers({ children }: { children: React.ReactNode }) {
  // SessionProvider removed - authentication is now handled via n8n and cookies
  return <>{children}</>
}

