'use client'

import { useState, useEffect } from 'react'
import { mockServiceDetails, type MockServiceDetail } from '@/lib/service-mock-data'

export interface UseServiceResult {
  service: MockServiceDetail | null
  isLoading: boolean
  error: string | null
}

export function useService(id: string): UseServiceResult {
  const [service, setService] = useState<MockServiceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setService(null)

    const timer = setTimeout(() => {
      const found = mockServiceDetails.find((s) => s.id === id)

      if (found) {
        setService(found)
        setIsLoading(false)
      } else {
        setError('NOT_FOUND')
        setIsLoading(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [id])

  return { service, isLoading, error }
}
