/**
 * NextAuth Configuration
 * 
 * Hinweis: Authentifizierung wird später über n8n geregelt.
 * Diese Konfiguration ist ein Platzhalter für die zukünftige Integration.
 */

import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    // Auth Provider werden später über n8n integriert
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
}
