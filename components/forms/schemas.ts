import z from "zod";

export const ApplySchema = z.object({
    name: z
        .string({ message: "Debes ingresa un nombre" })
        .min(2, { message: "Debes ingresar un nombre" })
        .max(500),
    bussinessName: z.string({ message: "Debes ingresa un nombre de empresa" }).min(2, { message: "Debes ingresar un nombre de empresa" }).max(50, { message: "El nombre de la empresa no puede superar los 50 caracteres" }),
    content: z
        .string({ message: "Debes ingresar un mensaje" })
        .min(20, { message: "El mensaje debe contener al menos 20 caracteres" })
        .max(1000, { message: "El mensaje no puede superar los 1000 caracteres" }),
    emailNotification: z.boolean().default(false)
})


// Guardar fecha de cuando se realizo la solicitud

export type ApplyFormValues = z.infer<typeof ApplySchema>


// Crear Evento Schema
export const CrearEventoSchema = z.object({
    eventTitle: z
        .string({ message: "You must enter an event title" })
        .min(2, { message: "Event title must be at least 2 characters" })
        .max(200, { message: "Event title cannot exceed 200 characters" }),
    scheduledDate: z.string({ message: "You must select a date" }).min(1, { message: "Date is required" }),
    commencementTime: z.string({ message: "You must select a time" }).min(1, { message: "Time is required" }),
    venueLocation: z
        .string({ message: "You must enter a venue location" })
        .min(2, { message: "Venue location must be at least 2 characters" })
        .max(300, { message: "Venue location cannot exceed 300 characters" }),
    categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
    longDescription: z
        .string({ message: "You must enter a description" })
        .min(20, { message: "Description must be at least 20 characters" })
        .max(5000, { message: "Description cannot exceed 5000 characters" }),
})

export type CrearEventoFormValues = z.infer<typeof CrearEventoSchema>


// Contact info item
const ContactInfoItemSchema = z.object({
    type: z.enum(['email', 'telefono', 'whatsapp', 'website', 'instagram', 'facebook', 'twitter']),
    value: z.string().min(1, 'El valor es requerido'),
})

// Crear Servicio Schema (alineado con API)
export const CrearServicioSchema = z.object({
    title: z
        .string({ message: 'Debes ingresar un título' })
        .min(2, 'El título debe tener al menos 2 caracteres')
        .max(200, 'El título no puede superar los 200 caracteres'),
    slug: z.string().optional().or(z.literal('')),
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
    yearsExperience: z
        .string()
        .optional()
        .or(z.literal('')),
    priceMin: z
        .string()
        .optional()
        .or(z.literal('')),
    priceMax: z
        .string()
        .optional()
        .or(z.literal('')),
    availability: z
        .string()
        .max(500, 'La disponibilidad no puede superar los 500 caracteres')
        .optional()
        .or(z.literal('')),
    contactInfo: z.array(ContactInfoItemSchema).optional().default([]),
    categoryId: z.string().optional().or(z.literal('')),
    locationId: z.string().optional().or(z.literal('')),
    bannerUrl: z.string().optional().or(z.literal('')),
    thumbnailUrl: z.string().optional().or(z.literal('')),
    serviceImages: z.array(z.string()).optional().default([]),
    serviceStatus: z.enum(['draft', 'published']).default('draft'),
})

export type CrearServicioFormValues = z.infer<typeof CrearServicioSchema>