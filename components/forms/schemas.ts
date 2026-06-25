import z from "zod";

export const ApplySchema = z.object({
    name: z.string().min(2).max(50),
    bussinessName: z.string().min(2).max(50),
    content: z.string().min(10).max(1000),
    emailNotification: z.boolean().default(false)
})


// Guardar fecha de cuando se realizo la solicitud