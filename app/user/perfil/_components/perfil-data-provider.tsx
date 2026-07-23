'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PerfilData } from '../types'

const PerfilDataContext = createContext<PerfilData | null>(null)

export function PerfilDataProvider({
  children,
  profile,
  regiones,
}: {
  children: ReactNode
  profile: PerfilData['profile']
  regiones: PerfilData['regiones']
}) {
  return (
    <PerfilDataContext.Provider value={{ profile, regiones }}>
      {children}
    </PerfilDataContext.Provider>
  )
}

export function usePerfilData(): PerfilData {
  const context = useContext(PerfilDataContext)
  if (!context) {
    throw new Error('usePerfilData must be used within PerfilLayout')
  }
  return context
}
