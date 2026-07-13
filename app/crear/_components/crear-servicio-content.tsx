'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Plus, Trash2, Loader2, AlertCircle, CheckCircle2, Camera, X, ImageIcon,
} from 'lucide-react'

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
import { serviciosApi } from '@/lib/servicios-api'
import { catalogoApi } from '@/lib/catalogo-api'
import { uploadFiles } from '@/lib/uploadthing'
import { generateSlug } from '@/lib/slug'
import { cn } from '@/lib/utils'
import { FormSidebar } from './form-sidebar'

const steps = [
  { id: 'brand-essentials', label: 'Información General', number: '01' },
  { id: 'portfolio-narrative', label: 'Detalles del servicio', number: '02' },
  { id: 'service-details', label: 'Contacto', number: '03' },
]

// ── Upload sub-components ──

interface SingleUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  route: 'serviceBanner' | 'serviceThumbnail'
  aspectRatio?: string
}

function SingleImageUpload({ label, value, onChange, route, aspectRatio = '16:9' }: SingleUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleUpload(file: File) {
    setUploading(true)
    setFeedback('idle')
    try {
      const [result] = await uploadFiles(route, { files: [file] })
      onChange(result.url)
      setFeedback('success')
      setTimeout(() => setFeedback('idle'), 3000)
    } catch {
      setFeedback('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div
        className={cn(
          'relative rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200',
          'group cursor-pointer',
          value ? 'border-border' : 'border-muted-foreground/20 hover:border-primary/50',
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <div className={cn('relative overflow-hidden', aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square')}>
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className={cn('flex flex-col items-center justify-center gap-2 p-8', aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square')}>
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              {uploading ? 'Subiendo...' : 'Hacé clic para subir'}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {feedback === 'success' && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
        {feedback === 'error' && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <AlertCircle className="h-4 w-4" />
          </div>
        )}

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />
      </div>
      {value && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">Imagen subida</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-destructive hover:text-destructive"
            onClick={() => onChange('')}
          >
            Eliminar
          </Button>
        </div>
      )}
    </div>
  )
}

interface MultiImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  max?: number
}

function MultiImageUpload({ images, onChange, max = 4 }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleUpload(file: File) {
    setUploading(true)
    setFeedback('idle')
    try {
      const [result] = await uploadFiles('serviceImages', { files: [file] })
      onChange([...images, result.url])
      setFeedback('success')
      setTimeout(() => setFeedback('idle'), 3000)
    } catch {
      setFeedback('error')
    } finally {
      setUploading(false)
    }
  }

  const canAdd = images.length < max

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none">
          Imágenes del servicio ({images.length}/{max})
        </label>
        {feedback === 'success' && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Imagen agregada
          </span>
        )}
        {feedback === 'error' && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            Error al subir
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="150px" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200',
              uploading
                ? 'border-muted bg-muted/30 cursor-not-allowed'
                : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 cursor-pointer',
            )}
            onClick={() => !uploading && inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Plus className="h-6 w-6 text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground/60 font-medium">Agregar</span>
              </>
            )}
          </button>
        )}

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

// ── Main component ──

export function CrearServicioContent() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState('brand-essentials')

  // ── Queries ──

  const { data: categoriasRes, isLoading: catsLoading, isError: catsError, error: catsErrorObj } = useQuery({
    queryKey: ['categorias', 'service'],
    queryFn: () => catalogoApi.categorias('service'),
  })

  const { data: ubicacionesRes, isLoading: ubicacionesLoading, isError: ubicacionesError, error: ubicacionesErrorObj } = useQuery({
    queryKey: ['ubicaciones'],
    queryFn: () => catalogoApi.ubicaciones(),
  })

  const categorias = categoriasRes?.data ?? []
  const ubicaciones = ubicacionesRes?.data ?? []

  // ── Form ──

  const form = useForm<CrearServicioFormValues>({
    resolver: zodResolver(CrearServicioSchema),
    defaultValues: {
      title: '',
      slug: '',
      marca: '',
      description: '',
      yearsExperience: '',
      priceMin: '',
      priceMax: '',
      availability: '',
      contacts: [{ type: 'email', value: '' }],
      categoryId: '',
      locationId: '',
      bannerUrl: '',
      thumbnailUrl: '',
      serviceImages: [],
      status: 'draft',
    },
  })

  const watchedTitle = form.watch('title')

  // Auto-generar slug silenciosamente desde el título
  useEffect(() => {
    if (watchedTitle) {
      const slug = generateSlug(watchedTitle)
      form.setValue('slug', slug, { shouldValidate: slug.length >= 2 })
    }
  }, [watchedTitle, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  })

  // ── Mutation ──

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof serviciosApi.create>[0]) =>
      serviciosApi.create(payload),
    onSuccess: (res) => {
      if (res.success) {
        router.push(`/servicios/${res.data.id}`)
      }
    },
  })

  if (mutation.isError) {
    console.log("mutation error", mutation.error)
  }

  // ── Handlers ──

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId)
    document.getElementById(stepId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function buildPayload(data: CrearServicioFormValues) {
    const portfolioImages: { url: string; title: string; description: string }[] =
      (data.serviceImages ?? []).map((url) => ({
        url,
        title: '',
        description: '',
      }))

    return {
      slug: data.slug || generateSlug(data.title),
      title: data.title,
      marca: data.marca || null,
      description: data.description || null,
      yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : null,
      priceMin: data.priceMin ? Number(data.priceMin) : null,
      priceMax: data.priceMax ? Number(data.priceMax) : null,
      availability: data.availability || null,
      contacts: data.contacts?.filter((c) => c.value.trim()) ?? [],
      categoryId: data.categoryId || null,
      locationId: data.locationId || null,
      bannerUrl: data.bannerUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      portfolio: portfolioImages,
      status: data.status,
    }
  }

  function handleFormSubmit(data: CrearServicioFormValues) {
    mutation.mutate({ ...buildPayload(data), status: 'published' })
  }

  function handleSaveDraft() {
    const data = form.getValues()
    mutation.mutate({ ...buildPayload(data), status: 'draft' })
  }

  const contactTypes = [
    { value: 'email', label: 'Correo' },
    { value: 'telefono', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'website', label: 'Sitio web' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'X' },
  ] as const

  const bannerUrl = form.watch('bannerUrl') ?? ''
  const thumbnailUrl = form.watch('thumbnailUrl') ?? ''
  const serviceImages = form.watch('serviceImages') ?? []

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <FormSidebar
            title="Crear servicio"
            description="Completa los datos de tu servicio para publicarlo en el directorio de proveedores."
            steps={steps}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          <div className="flex-1">
            {/* Status banner */}
            {mutation.isError && (
              <div className="flex items-center gap-2 p-4 mb-6 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{mutation.error instanceof Error ? mutation.error.message : 'Error al crear el servicio.'}</span>
              </div>
            )}

            {catsError && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Error al cargar categorías: {catsErrorObj instanceof Error ? catsErrorObj.message : 'Error desconocido'}</span>
              </div>
            )}

            {ubicacionesError && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Error al cargar ubicaciones: {ubicacionesErrorObj instanceof Error ? ubicacionesErrorObj.message : 'Error desconocido'}</span>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
                {/* ── Section 01: Información General ── */}
                <div className="space-y-6">
                  <h2 id="brand-essentials" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    01 Información general del servicio
                  </h2>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del servicio *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Producción de Eventos Corporativos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca / Nombre comercial</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: EventPro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={catsLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={catsLoading ? 'Cargando...' : 'Seleccioná una categoría'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categorias.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Años de experiencia</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="Ej: 8" {...field} />
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
                            <Input placeholder="Ej: Lun-Sáb 9:00-22:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ubicación */}
                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccioná una ubicación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ubicaciones.map((ubicacion) => (
                              <SelectItem key={ubicacion.id} value={ubicacion.id}>
                                {ubicacion.region.name} — {ubicacion.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ── Section 02: Detalles + Imágenes ── */}
                <div className="space-y-6">
                  <h2 id="portfolio-narrative" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    02 Detalles del servicio
                  </h2>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del servicio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describí qué ofrecés, tipo de servicios, estilo, etc. Esta descripción la verán los clientes."
                            className="min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priceMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio mínimo (CLP)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="Ej: 1500000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio máximo (CLP)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="Ej: 15000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Imágenes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SingleImageUpload
                      label="Banner del servicio"
                      value={bannerUrl}
                      onChange={(url) => form.setValue('bannerUrl', url)}
                      route="serviceBanner"
                      aspectRatio="16:9"
                    />
                    <SingleImageUpload
                      label="Miniatura (thumbnail)"
                      value={thumbnailUrl}
                      onChange={(url) => form.setValue('thumbnailUrl', url)}
                      route="serviceThumbnail"
                      aspectRatio="1:1"
                    />
                  </div>

                  <MultiImageUpload
                    images={serviceImages}
                    onChange={(urls) => form.setValue('serviceImages', urls)}
                    max={4}
                  />
                </div>

                {/* ── Section 03: Contacto ── */}
                <div className="space-y-6">
                  <h2 id="service-details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
                    03 Información de Contacto
                  </h2>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-3">
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.type`}
                          render={({ field: tf }) => (
                            <FormItem className="w-[140px] flex-shrink-0">
                              <Select onValueChange={tf.onChange} defaultValue={tf.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {contactTypes.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`contacts.${index}.value`}
                          render={({ field: vf }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder={
                                    form.watch(`contacts.${index}.type`) === 'email'
                                      ? 'correo@ejemplo.cl'
                                      : form.watch(`contacts.${index}.type`) === 'whatsapp'
                                        ? '+56912345678'
                                        : form.watch(`contacts.${index}.type`) === 'website'
                                          ? 'https://ejemplo.cl'
                                          : 'Valor'
                                  }
                                  {...vf}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-0 flex-shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => append({ type: 'email', value: '' })}
                    >
                      <Plus className="h-4 w-4" />
                      Agregar contacto
                    </Button>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    disabled={mutation.isPending}
                    onClick={handleSaveDraft}
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Guardando...</>
                    ) : 'Guardar como borrador'}
                  </Button>
                  <Button type="submit" className="flex-1 sm:flex-none" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Publicando...</>
                    ) : 'Publicar servicio'}
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
