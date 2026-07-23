'use client'

import { useQuery, queryOptions } from '@tanstack/react-query'
import { profileApi } from '@/lib/profile-api'

function mapHttpError(err: Error): string {
  const msg = err.message
  if (msg.includes('404')) return 'NOT_FOUND'
  if (msg.includes('401')) return 'UNAUTHORIZED'
  if (msg.includes('403')) return 'FORBIDDEN'
  if (msg.includes('503')) return 'SERVICE_UNAVAILABLE'
  if (msg.includes('429')) return 'RATE_LIMITED'
  if (msg.includes('Failed to fetch')) return 'NETWORK_ERROR'
  return 'UNKNOWN'
}

export const ProfileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['profile', userId],
    queryFn: () => profileApi.getByUserId(userId),
    enabled: !!userId,
  })

export function useProfile(userId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileApi.getByUserId(userId),
    enabled: !!userId,
    select: (res) => res?.data,
  })

  return {
    profile: data ?? null,
    isLoading,
    isError,
    error: error ? mapHttpError(error instanceof Error ? error : new Error(String(error))) : null,
    refetch,
  }
}
