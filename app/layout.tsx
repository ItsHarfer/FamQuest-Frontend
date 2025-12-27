import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import Providers from '@/components/providers/SessionProvider'
import './styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FamQuest - Transform Household Chaos into Epic Adventure',
  description: 'A cooperative Dark Fantasy RPG that transforms household management into a shared epic adventure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

