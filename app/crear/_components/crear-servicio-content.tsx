'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Camera } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CrearServicioSchema, type CrearServicioFormValues } from '@/components/forms/schemas'
import { FormSidebar } from './form-sidebar'

const steps = [
  { id: 'brand-essentials', label: 'Información General', number: '01' },
  { id: 'portfolio-narrative', label: 'Detalles del servicio', number: '02' },
  { id: 'service-details', label: 'Contacto', number: '03' },
]

const specialties = [
  'Producción',
  'Audiovisual',
  'Catering',
  'Seguridad',
  'Decoración',
  'Tecnología',
  'Espacios',
]

export function CrearServicioContent() {
  const [activeStep, setActiveStep] = useState('brand-essentials')

  const form = useForm<CrearServicioFormValues>({
    resolver: zodResolver(CrearServicioSchema),
    defaultValues: {
      serviceTitle: '',
      brandName: '',
      specialty: '',
      yearsExperience: '',
      coverage: '',
      serviceDescription: '',
      portfolioImages: [],
      pricingRange: '',
      availability: '',
      professionalEmail: '',
      businessPhone: '',
      website: '',
      socialMediaLinks: '',
    },
  })

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId)
    const el = document.getElementById(stepId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleFormSubmit = (data: CrearServicioFormValues) => {
    console.log('Servicio data:', data)
  }

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <FormSidebar
            title="Describe tu servicio"
            description="Describe tu servicio para nuestro exclusivo directorio de proveedores de eventos."
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          {/* Form Content */}
          <div className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
                {/* Section 01: Brand Essentials */}
                <div className="space-y-6">
                  <h2 id="brand-essentials" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    01 Información general del servicio
                  </h2>

                  <FormField
                    control={form.control}
                    name="serviceTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ejemplo: Servicio de catering para eventos corporativos"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de tu marca</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ejemplo: Petal Floral Studio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una especialidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {specialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años de experiencia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ubicación de la empresa</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Localidad, región"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>


                  {/* editar */}
                  <FormField
                    control={form.control}
                    name="priceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rango de precios manejados en el servicio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1000-5000 CLP"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidad</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Lunes - Viernes"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 02: Portfolio & Narrative */}
                <div className="space-y-6">
                  <h2 id="portfolio-narrative" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    02 Información del servicio
                  </h2>

                  <FormField
                    control={form.control}
                    name="serviceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del servicio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="En esta sección debes indicar que realizas, tipo de servicios que ofreces, estilo, etc. Recuerda que esta será la descripción que verán los clientes para conocer tu servicio.  "
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    {/* <FormLabel>Portfolio Highlights</FormLabel> */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Placeholder images */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center"
                        >
                          <Camera className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      ))}
                      {/* Add button */}
                      <button
                        type="button"
                        className="aspect-square rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                      >
                        <Plus className="h-8 w-8 text-muted-foreground/60" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 03: Service Details */}
                <div className="space-y-6">
                  <h2 id="service-details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    03 Información de Contacto
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <FormField
                      control={form.control}
                      name="pricingRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pricing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="$ - Standard">$ - Standard</SelectItem>
                              <SelectItem value="$$ - Premium">$$ - Premium</SelectItem>
                              <SelectItem value="$$$ - Luxury">$$$ - Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Booking 6-12 months in advance"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="professionalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de contacto</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de telefono</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sitio Web</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} placeholder='Opcional' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaLinks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redes sociales</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='Opcional' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <Button type="button" variant="outline" className="flex-1 sm:flex-none">
                    Guardar como borrador
                  </Button>
                  <Button type="submit" className="flex-1 sm:flex-none">
                    Publicar servicio
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
