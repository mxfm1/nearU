'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { requestsApi, type RequestsListParams } from '@/lib/requests-api';

export const RequestsQueryOptions = (params?: RequestsListParams) =>
  queryOptions({
    queryKey: ['requests', params ?? {}],
    queryFn: () => requestsApi.list(params),
  });

export const ProfileVerificationChecklistQueryOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: ['requests', 'profile-verification', 'checklist'],
    queryFn: () => requestsApi.profileVerificationChecklist(),
    enabled,
    staleTime: 0,
  });

export function useRequests(params?: RequestsListParams) {
  return useQuery(RequestsQueryOptions(params));
}

export function useProfileVerificationChecklist(enabled: boolean) {
  return useQuery(ProfileVerificationChecklistQueryOptions(enabled));
}
