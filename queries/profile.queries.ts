import { queryOptions } from '@tanstack/react-query';
import { profileApi, type ProfilesListParams } from '@/lib/profile-api';

export const ProfilesQueryOptions = (params?: ProfilesListParams) =>
  queryOptions({
    queryKey: ['profiles', params],
    queryFn: () => profileApi.list(params),
    select: (res) => res?.data,
  });
