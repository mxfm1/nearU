import { ApiError } from './api/errors';
import type {
  ProfileVerificationChecklist,
  ProfileVerificationRequirementsErrorDetails,
  RequestStatus,
  UserRequest,
} from '@/types/contracts/requests';

export type ProfileVerificationState = 'none' | 'in_process' | 'approved' | 'rejected';

export const ACTIVE_REQUEST_STATUSES = ['pending', 'in_review'] as const satisfies RequestStatus[];

export const COMPLETED_REQUEST_STATUSES = [
  'approved',
  'rejected',
  'resolved',
  'cancelled',
] as const satisfies RequestStatus[];

export const PROFILE_VERIFICATION_ACTIVE_MESSAGE =
  'No puedes generar otra solicitud, tienes una en proceso';

export const PROFILE_VERIFICATION_REQUIREMENTS_MESSAGE =
  'No cumplís los requisitos obligatorios para solicitar la verificación.';

const REQUEST_TYPE_LABELS: Record<UserRequest['type'], string> = {
  profile_verification: 'Validación de perfil',
  profile_report: 'Reporte de perfil',
  publication_report: 'Reporte de publicación',
  withdrawal: 'Retiro',
  general_question: 'Consulta general',
  feedback: 'Feedback',
};

const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  resolved: 'Resuelta',
  cancelled: 'Cancelada',
};

export function isActiveRequestStatus(status: RequestStatus): boolean {
  return ACTIVE_REQUEST_STATUSES.includes(status as (typeof ACTIVE_REQUEST_STATUSES)[number]);
}

export function isCompletedRequestStatus(status: RequestStatus): boolean {
  return COMPLETED_REQUEST_STATUSES.includes(status as (typeof COMPLETED_REQUEST_STATUSES)[number]);
}

export function getActiveProfileVerificationRequest(requests: UserRequest[]): UserRequest | null {
  return (
    requests.find(
      (request) => request.type === 'profile_verification' && isActiveRequestStatus(request.status)
    ) ?? null
  );
}

export function getLatestProfileVerificationRequest(requests: UserRequest[]): UserRequest | null {
  return (
    requests
      .filter((request) => request.type === 'profile_verification')
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0] ?? null
  );
}

export function getProfileVerificationState(
  requests: UserRequest[],
  isProfileVerified?: boolean
): ProfileVerificationState {
  if (isProfileVerified) return 'approved';

  const latestRequest = getLatestProfileVerificationRequest(requests);
  if (!latestRequest) return 'none';
  if (isActiveRequestStatus(latestRequest.status)) return 'in_process';
  if (latestRequest.status === 'approved') return 'approved';
  if (latestRequest.status === 'rejected') return 'rejected';

  return 'none';
}

export function splitRequestsByStatus(requests: UserRequest[]): {
  active: UserRequest[];
  completed: UserRequest[];
} {
  const sorted = [...requests].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return {
    active: sorted.filter((request) => isActiveRequestStatus(request.status)),
    completed: sorted.filter((request) => isCompletedRequestStatus(request.status)),
  };
}

export function getRequestTypeLabel(type: UserRequest['type']): string {
  return REQUEST_TYPE_LABELS[type] ?? type;
}

export function getRequestStatusLabel(status: RequestStatus): string {
  return REQUEST_STATUS_LABELS[status] ?? status;
}

export function getProfileVerificationRequestErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.errorCode === 'CONFLICT') {
    return PROFILE_VERIFICATION_ACTIVE_MESSAGE;
  }

  if (
    error instanceof ApiError &&
    error.errorCode === 'PROFILE_VERIFICATION_REQUIREMENTS_NOT_MET'
  ) {
    return PROFILE_VERIFICATION_REQUIREMENTS_MESSAGE;
  }

  if (error instanceof Error) return error.message;

  return 'No pudimos generar la solicitud. Intentá de nuevo.';
}

export function getProfileVerificationRequirementsChecklist(
  error: unknown
): ProfileVerificationChecklist | null {
  if (
    !(error instanceof ApiError) ||
    error.errorCode !== 'PROFILE_VERIFICATION_REQUIREMENTS_NOT_MET'
  ) {
    return null;
  }

  const details = error.details as Partial<ProfileVerificationRequirementsErrorDetails> | undefined;
  return details?.checklist ?? null;
}
