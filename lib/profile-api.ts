import { apiFetch } from './api-client';
import type { paths } from '@/types/contracts/api-contracts-types';

// --- Types from OpenAPI Contract ---

type ProfileResponse = NonNullable<
  paths['/api/profiles/{userId}']['get']['responses']['200']['content']['application/json']['data']
>;

type UpdateProfileResponse = NonNullable<
  paths['/api/profiles/me']['patch']['responses']['200']['content']['application/json']['data']
>;

// --- Re-export ---

export type Profile = ProfileResponse;

export type SocialLink = NonNullable<ProfileResponse['socialLinks']>[number];

export type UpdateProfileData = NonNullable<
  paths['/api/profiles/me']['patch']['requestBody']
>['content']['application/json'];

// --- API Functions ---

export const profileApi = {
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
