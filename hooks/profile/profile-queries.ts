'use client';

import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/lib/profile-api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile-edit'],
    queryFn: () => profileApi.getMyProfile(),
  });
}
