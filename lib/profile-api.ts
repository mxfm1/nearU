import { apiFetch } from './api-client';
import type { paths } from '@/types/contracts/api-contracts-types';

// --- Types from OpenAPI Contract ---

type ProfileResponse = NonNullable<
  paths['/api/profiles/{userId}']['get']['responses']['200']['content']['application/json']['data']
>;

type ProfilesResponse = NonNullable<
  paths['/api/profiles']['get']['responses']['200']['content']['application/json']['data']
>;

type UpdateProfileResponse = NonNullable<
  paths['/api/profiles/me']['patch']['responses']['200']['content']['application/json']['data']
>;

// --- Re-export ---

export type Profile = ProfileResponse;
export type ProfileListItem = ProfilesResponse[number];
export type ProfilesListParams = NonNullable<paths['/api/profiles']['get']['parameters']['query']>;

export type SocialLink = NonNullable<ProfileResponse['socialLinks']>[number];

export type UpdateProfileData = NonNullable<
  paths['/api/profiles/me']['patch']['requestBody']
>['content']['application/json'];

function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// --- API Functions ---

export const profileApi = {
  list: (params?: ProfilesListParams) =>
    apiFetch<{ success: boolean; data: ProfileListItem[] }>(`/profiles${toQueryString(params)}`),

  getByUserId: (userId: string) =>
    apiFetch<{ success: boolean; data: Profile }>(`/profiles/${userId}`),

  getById: (profileId: string) =>
    apiFetch<{ success: boolean; data: Profile }>(`/profiles/id/${profileId}`),

  getMyProfile: async (): Promise<Profile> => {
    const authRes = await apiFetch<{ success: boolean; data: { id: string } }>('/auth/me');
    const profileRes = await profileApi.getByUserId(authRes.data.id);
    return profileRes.data;
  },

  updateMine: (data: UpdateProfileData) =>
    apiFetch<{ success: boolean; data: UpdateProfileResponse }>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
