export type EstadoBadgeRecord = Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
>;

export const estadoBadge: EstadoBadgeRecord = {
  pendiente: { label: 'Pendiente', variant: 'default' },
  leido: { label: 'Leído', variant: 'secondary' },
  respondido: { label: 'Respondido', variant: 'outline' },
  archivado: { label: 'Archivado', variant: 'outline' },
};

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Hace ${minutes} min`;
    }
    return `Hace ${hours}h`;
  }
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;

  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
