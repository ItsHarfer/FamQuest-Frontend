import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Backgrounds
        midnight: '#0B1220', // Main App Background
        'deep-teal': '#102A36', // Cards / Chat Bubbles
        'arcane-violet': '#6E6AF6', // AI Guild Master Elements

        // Accents
        'ancient-gold': '#E0A96D', // Primary Actions
        'warm-copper': '#C9824A', // Secondary Actions
        'soft-cyan': '#7DD3FC', // Info / Neutral

        // Functional / Status
        'success-glow': '#5EEAD4', // Completed Quests
        'warning-ember': '#F590EB', // Deadlines
        'danger-rune': '#EF4444', // Errors / Boss Damage
      },
      fontFamily: {
        // Typography System
        serif: ['var(--font-cinzel)', ...fontFamily.serif], // Headers
        sans: ['var(--font-inter)', ...fontFamily.sans], // Body / Chat
      },
      backgroundImage: {
        // For the "Mists" effect
        'mist-gradient': 'linear-gradient(to top, #0B1220 0%, transparent 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(224, 169, 109, 0.3)',
        'glow-violet': '0 0 20px rgba(110, 106, 246, 0.3)',
        'glow-success': '0 0 20px rgba(94, 234, 212, 0.3)',
        'glow-ember': '0 0 20px rgba(245, 144, 235, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config

