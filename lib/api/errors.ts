export type BackendErrorCodes =
  | 'PROFILE_REQUIRED'
  | 'PROFILE_INCOMPLETE'
  | 'INPUT_PARSE_ERROR'
  | 'SELF_CONTACT'
  | 'MISSING_REFERENCE'
  | 'DUAL_REFERENCE'
  | 'VERIFICATION_FAILED'
  | 'INVALID_PASSWORD'
  | 'INVALID_EMAIL_OR_PASSWORD'
  | 'USER_ALREADY_EXISTS'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'APPLICATION_ALREADY_EXISTS'
  | 'INTERNAL_SERVER_ERROR';

export const ERROR_MESSAGES: Record<BackendErrorCodes, string> = {
  PROFILE_REQUIRED: 'Debés crear un perfil de empresa antes de publicar',
  PROFILE_INCOMPLETE: 'Completá los datos de tu perfil de empresa antes de publicar',
  INPUT_PARSE_ERROR: 'Verificá los datos ingresados',
  SELF_CONTACT: 'No podés contactarte a vos mismo',
  MISSING_REFERENCE: 'Falta especificar el servicio o evento',
  DUAL_REFERENCE: 'Elegí servicio o evento, no ambos',
  VERIFICATION_FAILED: 'El token de verificación expiró o es inválido',
  INVALID_PASSWORD: 'La contraseña actual es incorrecta',
  INVALID_EMAIL_OR_PASSWORD: 'Email o contraseña incorrectos',
  USER_ALREADY_EXISTS: 'Este email ya está registrado',
  UNAUTHENTICATED: 'Iniciá sesión para continuar',
  UNAUTHORIZED: 'No tenés permisos para esta acción',
  NOT_FOUND: 'El recurso no existe',
  CONFLICT: 'Ya existe un recurso con esos datos',
  VALIDATION_ERROR: 'Verificá los datos ingresados',
  APPLICATION_ALREADY_EXISTS: 'Ya tenés una postulación activa hacia este evento',
  INTERNAL_SERVER_ERROR: 'Error inesperado, intentá de nuevo',
};

export function getErrorMessage(code: string, fallback?: string): string {
  const known = ERROR_MESSAGES[code as BackendErrorCodes];
  return known ?? fallback ?? 'Error inesperado, intentá de nuevo';
}

export class ApiError extends Error {
  constructor(
    public readonly errorCode: BackendErrorCodes,
    message?: string
  ) {
    super(getErrorMessage(errorCode, message));
    this.name = 'ApiError';
  }
}
