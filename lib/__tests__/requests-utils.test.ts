import { ApiError } from '@/lib/api/errors';
import {
  getActiveProfileVerificationRequest,
  getLatestProfileVerificationRequest,
  getProfileVerificationRequirementsChecklist,
  getProfileVerificationRequestErrorMessage,
  getProfileVerificationState,
  isActiveRequestStatus,
  isCompletedRequestStatus,
  PROFILE_VERIFICATION_ACTIVE_MESSAGE,
  PROFILE_VERIFICATION_REQUIREMENTS_MESSAGE,
  splitRequestsByStatus,
} from '@/lib/requests-utils';
import type { UserRequest } from '@/types/contracts/requests';

function makeRequest(overrides: Partial<UserRequest>): UserRequest {
  return {
    id: overrides.id ?? 'request-id',
    profileId: overrides.profileId ?? 'profile-id',
    type: overrides.type ?? 'profile_verification',
    status: overrides.status ?? 'pending',
    title: overrides.title ?? 'Solicitud',
    description: overrides.description ?? null,
    metadata: overrides.metadata ?? null,
    targetEntityType: overrides.targetEntityType ?? null,
    targetEntityId: overrides.targetEntityId ?? null,
    reviewerUserId: overrides.reviewerUserId ?? null,
    reviewerComment: overrides.reviewerComment ?? null,
    createdAt: overrides.createdAt ?? '2026-08-25T10:00:00.000Z',
    updatedAt: overrides.updatedAt ?? '2026-08-25T10:00:00.000Z',
    reviewedAt: overrides.reviewedAt ?? null,
  };
}

describe('requests-utils', () => {
  it('detecta estados activos y realizados', () => {
    expect(isActiveRequestStatus('pending')).toBe(true);
    expect(isActiveRequestStatus('in_review')).toBe(true);
    expect(isActiveRequestStatus('approved')).toBe(false);
    expect(isCompletedRequestStatus('approved')).toBe(true);
    expect(isCompletedRequestStatus('cancelled')).toBe(true);
    expect(isCompletedRequestStatus('pending')).toBe(false);
  });

  it('encuentra una validación de perfil activa', () => {
    const active = makeRequest({ id: 'active', status: 'in_review' });
    const requests = [
      makeRequest({ id: 'report', type: 'profile_report', status: 'pending' }),
      makeRequest({ id: 'old-verification', status: 'approved' }),
      active,
    ];

    expect(getActiveProfileVerificationRequest(requests)).toBe(active);
  });

  it('encuentra la última solicitud de validación de perfil', () => {
    const oldRejected = makeRequest({
      id: 'old',
      status: 'rejected',
      createdAt: '2026-08-24T10:00:00.000Z',
    });
    const newest = makeRequest({
      id: 'newest',
      status: 'pending',
      createdAt: '2026-08-25T10:00:00.000Z',
    });
    const unrelated = makeRequest({
      id: 'report',
      type: 'profile_report',
      status: 'pending',
      createdAt: '2026-08-26T10:00:00.000Z',
    });

    expect(getLatestProfileVerificationRequest([oldRejected, unrelated, newest])).toBe(newest);
  });

  it('calcula el estado visual de validación de perfil', () => {
    expect(getProfileVerificationState([], true)).toBe('approved');
    expect(getProfileVerificationState([], false)).toBe('none');
    expect(getProfileVerificationState([makeRequest({ status: 'in_review' })], false)).toBe(
      'in_process'
    );
    expect(getProfileVerificationState([makeRequest({ status: 'approved' })], false)).toBe(
      'approved'
    );
    expect(getProfileVerificationState([makeRequest({ status: 'rejected' })], false)).toBe(
      'rejected'
    );
    expect(getProfileVerificationState([makeRequest({ status: 'cancelled' })], false)).toBe('none');
  });

  it('separa solicitudes activas y realizadas ordenadas por fecha descendente', () => {
    const newestActive = makeRequest({ id: 'new-active', createdAt: '2026-08-25T12:00:00.000Z' });
    const oldestActive = makeRequest({ id: 'old-active', createdAt: '2026-08-25T08:00:00.000Z' });
    const completed = makeRequest({
      id: 'completed',
      status: 'resolved',
      createdAt: '2026-08-25T11:00:00.000Z',
    });

    expect(splitRequestsByStatus([oldestActive, completed, newestActive])).toEqual({
      active: [newestActive, oldestActive],
      completed: [completed],
    });
  });

  it('traduce conflictos de validación al mensaje de dominio reservado', () => {
    expect(getProfileVerificationRequestErrorMessage(new ApiError('CONFLICT'))).toBe(
      PROFILE_VERIFICATION_ACTIVE_MESSAGE
    );
  });

  it('traduce requisitos incompletos y expone el checklist del backend', () => {
    const checklist = {
      eligible: false,
      checks: [
        {
          key: 'HAS_NAME' as const,
          label: 'Nombre',
          description: 'Perfil con nombre',
          required: true,
          passed: false,
          message: 'Falta completar el nombre',
        },
      ],
    };
    const error = new ApiError('PROFILE_VERIFICATION_REQUIREMENTS_NOT_MET', undefined, {
      checklist,
    });

    expect(getProfileVerificationRequestErrorMessage(error)).toBe(
      PROFILE_VERIFICATION_REQUIREMENTS_MESSAGE
    );
    expect(getProfileVerificationRequirementsChecklist(error)).toBe(checklist);
  });

  it('usa el mensaje original para errores no conflictivos', () => {
    expect(getProfileVerificationRequestErrorMessage(new Error('Error específico'))).toBe(
      'Error específico'
    );
  });
});
