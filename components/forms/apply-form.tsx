'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

import { ApplyFormValues, ApplySchema } from './schemas'

export const ApplyForm = () => {
    const form = useForm<ApplyFormValues>({
        resolver: zodResolver(ApplySchema),
        defaultValues: {
            name: '',
            bussinessName: '',
            content: '',
            emailNotification: false,
        },
    })

    const handleFormSubmit = (data: ApplyFormValues) => {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej. Felipe Muñoz"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bussinessName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nombre de tu empresa"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensaje</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Expresa tus necesidades a la empresa"
                                    className="min-h-32 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className='text-zinc-400'>
                                Este mensaje será enviado directamente al proveedor.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="emailNotification"
                    render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 rounded-sm border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                            <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                    Deseo enviar un email a la empresa de mi solicitud
                                </FormLabel>

                                {/* <FormDescription>
                                    Además de recibir la respuesta dentro de NearU, se enviará una
                                    copia a tu correo electrónico.
                                </FormDescription> */}
                            </div>
                        </FormItem>
                    )}
                />

                <Button className="w-full" size="lg" type="submit">
                    Enviar solicitud
                </Button>
            </form>
        </Form>
    )
}