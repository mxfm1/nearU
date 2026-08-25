import { apiFetch } from './api-client';
import { ApiError, type BackendErrorCodes } from './api/errors';
import type {
  CreateUserRequestPayload,
  ProfileVerificationChecklist,
  ProfileVerificationRequirementsErrorDetails,
  RequestsListParams,
  UserRequest,
} from '@/types/contracts/requests';

export type {
  CreateUserRequestPayload,
  ProfileVerificationChecklist,
  ProfileVerificationRequirementsErrorDetails,
  RequestStatus,
  RequestsListParams,
  UserRequest,
} from '@/types/contracts/requests';

type CreateRequestResponse =
  | { success: true; data: UserRequest }
  | {
      success: false;
      errorCode: BackendErrorCodes;
      details?: ProfileVerificationRequirementsErrorDetails;
    };

function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const requestsApi = {
  list: (params?: RequestsListParams) =>
    apiFetch<{ success: boolean; data: UserRequest[] }>(`/requests${toQueryString(params)}`),

  create: async (payload: CreateUserRequestPayload) => {
    const response = await apiFetch<CreateRequestResponse>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.success) {
      throw new ApiError(response.errorCode, undefined, response.details);
    }

    return response;
  },

  profileVerificationChecklist: () =>
    apiFetch<{ success: boolean; data: ProfileVerificationChecklist }>(
      '/requests/profile-verification/checklist'
    ),
};
