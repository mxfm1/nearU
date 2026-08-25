import type { ServicioDetalle } from '@/types/contracts/services';

type ContactEntry = NonNullable<ServicioDetalle['contacts']>[number];
type PortfolioEntry = NonNullable<ServicioDetalle['portfolio']>[number];

export type SafeContact = {
  type: string;
  label: string;
  value: string;
  href?: string;
};

export type SafePortfolioImage = PortfolioEntry & { url: string };

const CONTACT_LABELS: Record<string, string> = {
  email: 'Correo',
  telefono: 'Teléfono',
  phone: 'Teléfono',
  whatsapp: 'WhatsApp',
  website: 'Sitio web',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
};

const MODALITY_LABELS: Record<string, string> = {
  in_person: 'Presencial',
  online: 'Online',
  hybrid: 'Híbrida',
};

export function getProviderName(service: ServicioDetalle): string {
  return service.marca ?? service.profile?.name ?? 'Proveedor';
}

export function getProviderInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'P';
}

export function formatAvailability(service: ServicioDetalle): string | null {
  if (service.availabilityDetails) return service.availabilityDetails;
  if (service.availability === 'immediate') return 'Inmediata';
  if (service.availability === 'not_immediate') return 'A coordinar';
  return null;
}

export function formatAvailabilityBadge(value?: string | null): string | null {
  if (value === 'immediate') return 'Inmediata';
  if (value === 'not_immediate') return 'A coordinar';
  return null;
}

export function formatPriceRange(
  priceMin?: number | null,
  priceMax?: number | null
): string | null {
  if (typeof priceMin === 'number' && typeof priceMax === 'number')
    return `${priceMin} - ${priceMax}`;
  if (typeof priceMin === 'number') return `Desde ${priceMin}`;
  if (typeof priceMax === 'number') return `Hasta ${priceMax}`;
  return null;
}

export function formatModality(value?: string | null): string | null {
  if (!value) return null;
  return MODALITY_LABELS[value] ?? value;
}

export function formatExperience(value?: number | null): string | null {
  if (typeof value !== 'number') return null;
  return `${value} ${value === 1 ? 'año' : 'años'} de experiencia`;
}

export function splitParagraphs(value?: string | null): string[] {
  return (value ?? '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function getPortfolioImages(portfolio?: ServicioDetalle['portfolio']): SafePortfolioImage[] {
  return (portfolio ?? [])
    .filter((image): image is SafePortfolioImage => Boolean(image.url))
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

export function getSafeContacts(contacts?: ServicioDetalle['contacts']): SafeContact[] {
  return (contacts ?? []).reduce<SafeContact[]>((acc, contact) => {
    const safe = toSafeContact(contact);
    if (safe) acc.push(safe);
    return acc;
  }, []);
}

function toSafeContact(contact: ContactEntry): SafeContact | null {
  const value = contact.value?.trim();
  if (!value) return null;

  const type = contact.type?.trim().toLowerCase() || 'contacto';
  const label = CONTACT_LABELS[type] ?? 'Contacto';

  if (type === 'email') return { type, label, value, href: `mailto:${value}` };
  if (type === 'telefono' || type === 'phone') return { type, label, value, href: `tel:${value}` };
  if (type === 'whatsapp') {
    const digits = value.replace(/\D/g, '');
    return { type, label, value, href: digits ? `https://wa.me/${digits}` : undefined };
  }
  if (type === 'website' || type === 'instagram' || type === 'facebook' || type === 'twitter') {
    return { type, label, value, href: toSafeUrl(value) };
  }

  return { type, label, value };
}

function toSafeUrl(value: string): string | undefined {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
