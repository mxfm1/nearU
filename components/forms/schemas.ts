import z from 'zod';

const INTENCIONES = [
  'Solicitar una cotización',
  'Solicitar una propuesta comercial',
  'Consultar disponibilidad',
  'Realizar una consulta sobre el servicio',
] as const;

export const ApplySchema = z.object({
  intencion: z.enum(INTENCIONES, {
    required_error: 'Debes seleccionar una intención',
    invalid_type_error: 'Selecciona una intención válida',
  }),
  mensaje: z
    .string({ required_error: 'El mensaje es obligatorio' })
    .min(1, 'El mensaje no puede estar vacío')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
  attachments: z
    .array(z.string().url('Cada adjunto debe ser una URL válida'))
    .max(6, 'Máximo 6 archivos adjuntos')
    .optional()
    .default([]),
});

export type ApplyFormValues = z.infer<typeof ApplySchema>;

// Crear Evento Schema (alineado con API)
export const CrearEventoSchema = z.object({
  title: z
    .string({ message: 'Debés ingresar un título' })
    .min(1, 'Debés ingresar un título')
    .max(200, 'El título no puede superar los 200 caracteres'),
  slug: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(5000, 'La descripción no puede superar los 5000 caracteres')
    .optional()
    .or(z.literal('')),
  applicationDeadline: z
    .string({ message: 'Debés ingresar la fecha límite de postulación' })
    .min(1, 'Debés ingresar la fecha límite de postulación'),
  requiredCandidates: z
    // .coerce({ message: 'Debés ingresar un número válido' })
    .number()
    .int('Debe ser un número entero')
    .min(1, 'Debe ser al menos 1')
    .max(999, 'No puede superar 999 candidatos')
    .default(1),
  requiresVerifiedProfile: z.boolean().default(false),
  autoCloseWhenFilled: z.boolean().default(true),
  requirements: z
    .string()
    .max(5000, 'Los requisitos no pueden superar los 5000 caracteres')
    .optional()
    .or(z.literal('')),
  locationId: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  bannerUrl: z.string().optional().or(z.literal('')),
  eventStatus: z.enum(['draft', 'published']).default('draft'),
});

export type CrearEventoFormValues = z.infer<typeof CrearEventoSchema>;

// Contact info item
const ContactInfoItemSchema = z.object({
  type: z.enum(['email', 'telefono', 'whatsapp', 'website', 'instagram', 'facebook', 'twitter']),
  value: z.string().trim().min(1, 'Debés ingresar el dato de contacto'),
});

function parseOptionalNumber(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

// Crear Servicio Schema (alineado con API)
export const CrearServicioSchema = z
  .object({
    title: z
      .string({ message: 'Debés ingresar un título' })
      .trim()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(200, 'El título no puede superar los 200 caracteres'),
    marca: z
      .string()
      .max(200, 'La marca no puede superar los 200 caracteres')
      .optional()
      .or(z.literal('')),
    description: z
      .string()
      .max(5000, 'La descripción no puede superar los 5000 caracteres')
      .optional()
      .or(z.literal('')),
    yearsExperience: z.string().optional().or(z.literal('')),
    priceMin: z.string().optional().or(z.literal('')),
    priceMax: z.string().optional().or(z.literal('')),
    availability: z.enum(['immediate', 'not_immediate']).optional().or(z.literal('')),
    availabilityDetails: z
      .string()
      .max(500, 'El detalle de disponibilidad no puede superar los 500 caracteres')
      .optional()
      .or(z.literal('')),
    modality: z.enum(['in_person', 'online', 'hybrid']).optional().or(z.literal('')),
    contacts: z.array(ContactInfoItemSchema).min(1, 'Debés agregar al menos un contacto'),
    categoryId: z.string().optional().or(z.literal('')),
    locationId: z.string().optional().or(z.literal('')),
    bannerUrl: z.string().optional().or(z.literal('')),
    logoUrl: z.string().optional().or(z.literal('')),
    thumbnailUrl: z.string().optional().or(z.literal('')),
    serviceImages: z.array(z.string()).optional().default([]),
    status: z.enum(['draft', 'published', 'paused', 'archived']).default('draft'),
  })
  .superRefine((data, ctx) => {
    const priceMin = parseOptionalNumber(data.priceMin);
    const priceMax = parseOptionalNumber(data.priceMax);
    const yearsExperience = parseOptionalNumber(data.yearsExperience);

    if (
      data.yearsExperience &&
      (yearsExperience === null || !Number.isInteger(yearsExperience) || yearsExperience < 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['yearsExperience'],
        message: 'Ingresá una cantidad de años válida',
      });
    }

    if (data.priceMin && (priceMin === null || priceMin < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMin'],
        message: 'Ingresá un precio mínimo válido',
      });
    }

    if (data.priceMax && (priceMax === null || priceMax < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMax'],
        message: 'Ingresá un precio máximo válido',
      });
    }

    if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMax'],
        message: 'El precio máximo debe ser mayor o igual al mínimo',
      });
    }
  });

export type CrearServicioFormValues = z.infer<typeof CrearServicioSchema>;

// --- Scoring Rules Schema ---

const ScoringRuleSchema = z.object({
  ruleType: z
    .string({ message: 'Debés seleccionar un tipo de regla' })
    .min(1, 'El tipo de regla es obligatorio'),
  weight: z
    .number({ message: 'El puntaje debe ser un número' })
    .min(0, 'El puntaje no puede ser negativo')
    .max(100, 'El puntaje no puede superar 100')
    .default(1),
  config: z.record(z.unknown()).nullable().optional().default(null),
});

export const ScoringRulesFormSchema = z.object({
  rules: z.array(ScoringRuleSchema).min(1, 'Debe agregar al menos una regla de puntaje'),
});

export type ScoringRuleFormValues = z.infer<typeof ScoringRuleSchema>;
export type ScoringRulesFormValues = z.infer<typeof ScoringRulesFormSchema>;

// --- Application Form Schema (Phase 1) ---

export const ApplicationFormSchema = z.object({
  coverLetter: z.string().max(400, 'La carta de presentación no puede superar los 400 caracteres'),
});

export type ApplicationFormValues = z.infer<typeof ApplicationFormSchema>;
