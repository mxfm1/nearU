'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi, type User } from '@/lib/api-client'

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await authApi.getMe()
      setUser(res.data!)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    await authApi.signIn(email, password)
    await refresh()
  }

  const register = async (name: string, email: string, password: string) => {
    await authApi.signUp(name, email, password)
    await refresh()
  }

  const logout = async () => {
    await authApi.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
