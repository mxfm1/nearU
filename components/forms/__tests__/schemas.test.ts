import { CrearServicioSchema } from '../schemas';

const validService = {
  title: 'Producción audiovisual',
  marca: '',
  description: '',
  yearsExperience: '',
  priceMin: '',
  priceMax: '',
  availability: '',
  availabilityDetails: '',
  modality: '',
  contacts: [{ type: 'email', value: 'hola@nearu.test' }],
  categoryId: '',
  locationId: '',
  bannerUrl: '',
  logoUrl: '',
  thumbnailUrl: '',
  serviceImages: [],
  status: 'published',
};

describe('CrearServicioSchema', () => {
  it('requires title and at least one contact value', () => {
    const result = CrearServicioSchema.safeParse({
      ...validService,
      title: '',
      contacts: [{ type: 'email', value: '' }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain(
        'El título debe tener al menos 2 caracteres'
      );
      expect(result.error.flatten().fieldErrors.contacts).toContain(
        'Debés ingresar el dato de contacto'
      );
    }
  });

  it('validates numeric fields and price range', () => {
    const result = CrearServicioSchema.safeParse({
      ...validService,
      yearsExperience: '-1',
      priceMin: '200',
      priceMax: '100',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.yearsExperience).toContain('Ingresá una cantidad de años válida');
      expect(fieldErrors.priceMax).toContain('El precio máximo debe ser mayor o igual al mínimo');
    }
  });
});
