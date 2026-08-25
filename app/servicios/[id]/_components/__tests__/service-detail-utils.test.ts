import type { ServicioDetalle } from '@/types/contracts/services';
import {
  formatAvailability,
  formatExperience,
  formatModality,
  formatPriceRange,
  getPortfolioImages,
  getProviderInitial,
  getProviderName,
  getSafeContacts,
  splitParagraphs,
} from '../service-detail-utils';

describe('service detail utils', () => {
  it('formats price ranges without inventing currency or unit', () => {
    expect(formatPriceRange(10, 25)).toBe('10 - 25');
    expect(formatPriceRange(10, null)).toBe('Desde 10');
    expect(formatPriceRange(null, 25)).toBe('Hasta 25');
    expect(formatPriceRange(null, null)).toBeNull();
  });

  it('prefers availability details over enum labels', () => {
    expect(formatAvailability({ availability: 'immediate' } as ServicioDetalle)).toBe('Inmediata');
    expect(formatAvailability({ availability: 'not_immediate' } as ServicioDetalle)).toBe(
      'A coordinar'
    );
    expect(
      formatAvailability({
        availability: 'immediate',
        availabilityDetails: 'Sólo fines de semana',
      } as ServicioDetalle)
    ).toBe('Sólo fines de semana');
  });

  it('formats modality and experience from contract values', () => {
    expect(formatModality('in_person')).toBe('Presencial');
    expect(formatModality('online')).toBe('Online');
    expect(formatModality('hybrid')).toBe('Híbrida');
    expect(formatExperience(1)).toBe('1 año de experiencia');
    expect(formatExperience(3)).toBe('3 años de experiencia');
  });

  it('derives provider display safely', () => {
    expect(getProviderName({ marca: 'Marca Uno' } as ServicioDetalle)).toBe('Marca Uno');
    expect(getProviderName({ profile: { name: 'Perfil Uno' } } as ServicioDetalle)).toBe(
      'Perfil Uno'
    );
    expect(getProviderInitial(' gourmet events')).toBe('G');
  });

  it('splits meaningful paragraphs only', () => {
    expect(splitParagraphs('Uno\n\n Dos \n')).toEqual(['Uno', 'Dos']);
  });

  it('filters and orders portfolio images by orden', () => {
    const images = getPortfolioImages([
      { url: 'b.jpg', orden: 2 },
      { title: 'Sin URL', orden: 1 },
      { url: 'a.jpg', orden: 1 },
    ] as ServicioDetalle['portfolio']);

    expect(images.map((image) => image.url)).toEqual(['a.jpg', 'b.jpg']);
  });

  it('creates safe contact links and keeps unknown contacts as text', () => {
    const contacts = getSafeContacts([
      { type: 'email', value: 'hola@nearu.test' },
      { type: 'whatsapp', value: '+598 99 123 456' },
      { type: 'website', value: 'nearu.test' },
      { type: 'otro', value: 'Sólo por formulario' },
      { type: 'email', value: '' },
    ] as ServicioDetalle['contacts']);

    expect(contacts).toHaveLength(4);
    expect(contacts[0]).toMatchObject({ href: 'mailto:hola@nearu.test' });
    expect(contacts[1]).toMatchObject({ href: 'https://wa.me/59899123456' });
    expect(contacts[2].href).toBe('https://nearu.test/');
    expect(contacts[3].label).toBe('Contacto');
    expect(contacts[3].href).toBeUndefined();
  });
});
