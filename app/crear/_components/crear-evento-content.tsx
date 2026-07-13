'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Loader2, AlertCircle, CheckCircle2, Camera, ImageIcon, Info,
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { CrearEventoSchema, type CrearEventoFormValues } from '@/components/forms/schemas'
import { eventosApi } from '@/lib/eventos-api'
import { catalogoApi } from '@/lib/catalogo-api'
import { uploadFiles } from '@/lib/uploadthing'
import { generateSlug } from '@/lib/slug'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'general', label: 'General' },
  { id: 'event', label: 'Evento' },
  { id: 'requirements', label: 'Requisitos' },
] as const

// --------------------------------------------------
//   Single Image Upload (compact)
// --------------------------------------------------

interface SingleUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  route: 'eventThumbnail' | 'eventBanner'
}

function SingleImageUpload({ label, value, onChange, route }: SingleUploadProps) {
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
          'relative rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200',
          'group cursor-pointer',
          value ? 'border-border' : 'border-muted-foreground/20 hover:border-primary/50',
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <div className="relative overflow-hidden aspect-[3/1]">
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-6">
            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              {uploading ? 'Subiendo...' : 'Subir portada'}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}

        {feedback === 'success' && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}
        {feedback === 'error' && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <AlertCircle className="h-3.5 w-3.5" />
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

// --------------------------------------------------
//   Main Component
// --------------------------------------------------

export function CrearEventoContent() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('general')
  const [selectedRegionId, setSelectedRegionId] = useState('')

  const tabsRef = useRef<HTMLDivElement>(null)

  // ── Queries ──
  const { data: categoriasRes, isLoading: catsLoading, isError: catsError, error: catsErrorObj } = useQuery({
    queryKey: ['categorias', 'event'],
    queryFn: () => catalogoApi.categorias('event'),
  })

  const { data: regionesRes, isLoading: regionesLoading, isError: regionesError, error: regionesErrorObj } = useQuery({
    queryKey: ['regiones'],
    queryFn: () => catalogoApi.regiones(),
  })

  const categorias = categoriasRes?.data ?? []
  const regiones = regionesRes?.data ?? []

  const selectedRegion = useMemo(
    () => regiones.find((r) => r.id === selectedRegionId),
    [regiones, selectedRegionId],
  )

  // ── Form ──
  const form = useForm<CrearEventoFormValues>({
    resolver: zodResolver(CrearEventoSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      applicationDeadline: '',
      requiredCandidates: 1,
      requiresVerifiedProfile: false,
      autoCloseWhenFilled: true,
      requirements: '',
      categoryId: '',
      locationId: '',
      thumbnailUrl: '',
      bannerUrl: '',
      eventStatus: 'draft',
    },
  })

  const watchedTitle = form.watch('title')

  useEffect(() => {
    if (watchedTitle) {
      const slug = generateSlug(watchedTitle)
      form.setValue('slug', slug, { shouldValidate: slug.length >= 2 })
    }
  }, [watchedTitle, form])

  // ── Mutation ──
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof eventosApi.create>[0]) =>
      eventosApi.create(payload),
    onSuccess: (res) => {
      if (res.success) {
        router.push(`/crear/evento/${res.data.id}`)
      }
    },
  })

  // ── Handlers ──
  function buildPayload(data: CrearEventoFormValues) {
    return {
      slug: data.slug || generateSlug(data.title),
      title: data.title,
      description: data.description || null,
      applicationDeadline: data.applicationDeadline || null,
      requiredCandidates: data.requiredCandidates,
      requiresVerifiedProfile: data.requiresVerifiedProfile,
      autoCloseWhenFilled: data.autoCloseWhenFilled,
      requirements: data.requirements || null,
      categoryId: data.categoryId || null,
      locationId: data.locationId || null,
      thumbnailUrl: data.thumbnailUrl || null,
      bannerUrl: data.bannerUrl || null,
      eventStatus: data.eventStatus,
    }
  }

  function handleFormSubmit(data: CrearEventoFormValues) {
    mutation.mutate({ ...buildPayload(data), eventStatus: 'published' })
  }

  function handleSaveDraft() {
    form.handleSubmit((data) => {
      mutation.mutate({ ...buildPayload(data), eventStatus: 'draft' })
    })()
  }

  function handleSectionClick(sectionId: string) {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const thumbnailUrl = form.watch('thumbnailUrl') ?? ''
  const bannerUrl = form.watch('bannerUrl') ?? ''

  return (
    <section className="min-h-screen bg-background">
      <div className="section-container pt-20 pb-12 md:pt-28 md:pb-16">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Crear evento
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completá los datos de tu evento para publicarlo en la plataforma.
          </p>
        </div>

        {/* ── Mobile-first: Top Category Tabs ── */}
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto pb-4 mb-6 md:mb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={cn(
                'category-pill whitespace-nowrap flex-shrink-0 transition-all duration-200',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700',
              )}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Errors */}
        {mutation.isError && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-destructive/10 text-destructive text-sm card-base border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{mutation.error instanceof Error ? mutation.error.message : 'Error al crear el evento.'}</span>
          </div>
        )}

        {catsError && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-sm card-base border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Error al cargar categorías: {catsErrorObj instanceof Error ? catsErrorObj.message : 'Error desconocido'}</span>
          </div>
        )}

        {regionesError && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-sm card-base border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Error al cargar regiones: {regionesErrorObj instanceof Error ? regionesErrorObj.message : 'Error desconocido'}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-10">

            {/* ═══════════════════════════════════════════
                Section 01: Información General
            ═══════════════════════════════════════════ */}
            <motion.div
              id="general"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card-base rounded-xl scroll-mt-24"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-6">
                01 Información General
              </h2>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del evento *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Conferencia de Innovación 2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describí de qué trata el evento, agenda, público objetivo, etc."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SingleImageUpload
                    label="Portada del evento"
                    value={thumbnailUrl}
                    onChange={(url) => form.setValue('thumbnailUrl', url)}
                    route="eventThumbnail"
                  />

                  <SingleImageUpload
                    label="Banner del evento"
                    value={bannerUrl}
                    onChange={(url) => form.setValue('bannerUrl', url)}
                    route="eventBanner"
                  />
                </div>
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                Section 02: Información del Evento
            ═══════════════════════════════════════════ */}
            <motion.div
              id="event"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="card-base rounded-xl scroll-mt-24"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-6">
                02 Información del Evento
              </h2>

              <div className="space-y-5">
                {/* Row: Deadline + Candidatos requeridos (1/2 grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha límite de postulación</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Info className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            Cuándo cierra las postulaciones
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiredCandidates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Candidatos requeridos</FormLabel>
                        <FormControl>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Input
                              type="number"
                              min={1}
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </motion.div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Personas a seleccionar
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Switches */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="requiresVerifiedProfile"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-3.5 bg-muted/30">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">Requiere perfil verificado</Label>
                          <p className="text-xs text-muted-foreground">
                            Solo postulantes verificados podrán aplicar
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoCloseWhenFilled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-3.5 bg-muted/30">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">Cerrar automáticamente</Label>
                          <p className="text-xs text-muted-foreground">
                            Se cierra cuando se cubran los cupos
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categoría */}
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

                {/* Región + Ubicación (1/2 grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Región</label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedRegionId(value)
                        form.setValue('locationId', '')
                      }}
                      value={selectedRegionId}
                      disabled={regionesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={regionesLoading ? 'Cargando...' : 'Seleccioná una región'} />
                      </SelectTrigger>
                      <SelectContent>
                        {regiones.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRegionId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={!selectedRegionId ? 'Primero elegí región' : 'Seleccioná una ubicación'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion?.locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                Section 03: Requisitos
            ═══════════════════════════════════════════ */}
            <motion.div
              id="requirements"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="card-base rounded-xl scroll-mt-24"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 mb-6">
                03 Requisitos
              </h2>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requisitos del evento</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describí los requisitos que deben cumplir los postulantes..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Indicá qué necesitan los candidatos para postularse
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none rounded-xl"
                disabled={mutation.isPending}
                onClick={handleSaveDraft}
              >
                {mutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Guardando...</>
                ) : 'Guardar como borrador'}
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none rounded-xl" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Guardando...</>
                ) : 'Guardar evento'}
              </Button>
            </div>
          </form>
        </Form>

        <div>
          <p className='text-sm text-zinc-400 mt-4'>**Si guardas como borrador, el evento estará guardado pero no se mostrará en la app. Lo puedes editar en tus publicaciones</p>
        </div>
      </div>
    </section>
  )
}
