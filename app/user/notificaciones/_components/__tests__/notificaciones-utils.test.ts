import { getSafeNotificationActionUrl } from '../notificaciones-utils';

describe('notificaciones utils', () => {
  it('allows only existing internal notification action routes', () => {
    expect(getSafeNotificationActionUrl('/servicios/catering-premium')).toBe(
      '/servicios/catering-premium'
    );
    expect(getSafeNotificationActionUrl('/eventos/evento-uno')).toBe('/eventos/evento-uno');
    expect(getSafeNotificationActionUrl('/user/mensajes/thread-1')).toBe('/user/mensajes/thread-1');
    expect(getSafeNotificationActionUrl('/user/publicaciones/evento/event-1/aplicaciones')).toBe(
      '/user/publicaciones/evento/event-1/aplicaciones'
    );
  });

  it('rejects unsafe or non-existing notification action routes', () => {
    expect(getSafeNotificationActionUrl('https://example.com')).toBeNull();
    expect(getSafeNotificationActionUrl('//example.com')).toBeNull();
    expect(getSafeNotificationActionUrl('javascript:alert(1)')).toBeNull();
    expect(getSafeNotificationActionUrl('/threads/thread-1')).toBeNull();
    expect(getSafeNotificationActionUrl('/mis-postulaciones')).toBeNull();
    expect(getSafeNotificationActionUrl('/solicitudes/request-1')).toBeNull();
    expect(getSafeNotificationActionUrl('/admin/solicitudes/request-1')).toBeNull();
  });
});
