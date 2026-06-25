'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { authClient } from '@/lib/auth-client'
import type { User, Session } from 'better-auth'

type AuthContextType = {
  user: User | null
  session: Session | null
  isPending: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isPending: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession()

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        session: data?.session ?? null,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
