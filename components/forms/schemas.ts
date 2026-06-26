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


// Crear Servicio Schema
export const CrearServicioSchema = z.object({
    serviceTitle: z
        .string({ message: "You must enter a service title" })
        .min(2, { message: "Service title must be at least 2 characters" })
        .max(200, { message: "Service title cannot exceed 200 characters" }),
    brandName: z
        .string({ message: "You must enter a brand name" })
        .min(2, { message: "Brand name must be at least 2 characters" })
        .max(100, { message: "Brand name cannot exceed 100 characters" }),
    specialty: z.string({ message: "You must select a specialty" }).min(1, { message: "Specialty is required" }),
    yearsExperience: z
        .string({ message: "You must enter years of experience" })
        .min(1, { message: "Years of experience is required" }),
    coverage: z
        .string({ message: "You must enter coverage area" })
        .min(2, { message: "Coverage area must be at least 2 characters" })
        .max(200, { message: "Coverage area cannot exceed 200 characters" }),
    serviceDescription: z
        .string({ message: "You must enter a description" })
        .min(20, { message: "Description must be at least 20 characters" })
        .max(5000, { message: "Description cannot exceed 5000 characters" }),
    portfolioImages: z.array(z.string()).optional(),
    pricingRange: z.string().optional(),
    availability: z.string().optional(),
    professionalEmail: z
        .string({ message: "You must enter a valid email" })
        .email({ message: "Invalid email address" }),
    businessPhone: z.string().optional(),
    website: z.string().optional(),
    socialMediaLinks: z.string().optional(),
})

export type CrearServicioFormValues = z.infer<typeof CrearServicioSchema>