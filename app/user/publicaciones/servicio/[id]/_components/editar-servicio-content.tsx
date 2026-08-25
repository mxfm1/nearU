'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CrearServicioSchema, type CrearServicioFormValues } from '@/components/forms/schemas';
import {
  useServiceDetail,
  useCategoriasServicio,
  useUbicaciones,
} from '@/hooks/services/service-queries';
import { useUpdateService } from '@/hooks/services/service-mutations';
import { uploadFiles } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import type { UpdateServicioPayload } from '@/lib/servicios-api';
import type { ServicioDetalle } from '@/types/contracts/services';
import { EditarServicioEmpty } from './editar-servicio-empty';
import { EditarServicioError } from './editar-servicio-error';
import { EditarServicioSkeleton } from './editar-servicio-skeleton';

interface EditarServicioContentProps {
  id: string;
}

type ContactType = CrearServicioFormValues['contacts'][number]['type'];
type UploadRoute = 'serviceBanner' | 'serviceThumbnail' | 'serviceImages';

const CONTACT_TYPES = [
  { value: 'email', label: 'Correo' },
  { value: 'telefono', label: 'Teléfono' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'website', label: 'Sitio web' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'X' },
] as const;

const STEPS = [
  { id: 'general', label: 'Información general', number: '01' },
  { id: 'details', label: 'Detalles', number: '02' },
  { id: 'contact', label: 'Contacto', number: '03' },
] as const;

const DEFAULT_VALUES: CrearServicioFormValues = {
  title: '',
  marca: '',
  description: '',
  yearsExperience: '',
  priceMin: '',
  priceMax: '',
  availability: '',
  availabilityDetails: '',
  modality: '',
  contacts: [{ type: 'email', value: '' }],
  categoryId: '',
  locationId: '',
  bannerUrl: '',
  logoUrl: '',
  thumbnailUrl: '',
  serviceImages: [],
  status: 'draft',
};

function toOptionalString(value?: string | null): string {
  return value ?? '';
}

function toContactType(value?: string): ContactType {
  return CONTACT_TYPES.some((type) => type.value === value) ? (value as ContactType) : 'email';
}

function toFormValues(service: ServicioDetalle): CrearServicioFormValues {
  return {
    title: service.title ?? '',
    marca: toOptionalString(service.marca),
    description: toOptionalString(service.description),
    yearsExperience:
      typeof service.yearsExperience === 'number' ? String(service.yearsExperience) : '',
    priceMin: typeof service.priceMin === 'number' ? String(service.priceMin) : '',
    priceMax: typeof service.priceMax === 'number' ? String(service.priceMax) : '',
    availability: service.availability ?? '',
    availabilityDetails: toOptionalString(service.availabilityDetails),
    modality: service.modality ?? '',
    contacts: service.contacts?.length
      ? service.contacts.map((contact) => ({
          type: toContactType(contact.type),
          value: contact.value ?? '',
        }))
      : [{ type: 'email', value: '' }],
    categoryId: service.category?.id ?? '',
    locationId: service.location?.id ?? '',
    bannerUrl: toOptionalString(service.bannerUrl),
    logoUrl: toOptionalString(service.logoUrl),
    thumbnailUrl: toOptionalString(service.thumbnailUrl),
    serviceImages:
      service.portfolio?.map((image) => image.url).filter((url): url is string => Boolean(url)) ??
      [],
    status:
      service.status?.slug === 'published'
        ? 'published'
        : service.status?.slug === 'paused'
          ? 'paused'
          : service.status?.slug === 'archived'
            ? 'archived'
            : 'draft',
  };
}

function buildPayload(data: CrearServicioFormValues): UpdateServicioPayload {
  const portfolio = (data.serviceImages ?? []).map((url) => ({
    url,
    title: '',
    description: '',
  }));

  return {
    title: data.title.trim(),
    marca: data.marca?.trim() || undefined,
    description: data.description?.trim() || undefined,
    yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : undefined,
    priceMin: data.priceMin ? Number(data.priceMin) : undefined,
    priceMax: data.priceMax ? Number(data.priceMax) : undefined,
    availability: data.availability || undefined,
    availabilityDetails: data.availabilityDetails?.trim() || undefined,
    modality: data.modality || undefined,
    bannerUrl: data.bannerUrl || undefined,
    logoUrl: data.logoUrl || undefined,
    thumbnailUrl: data.thumbnailUrl || undefined,
    locationId: data.locationId || undefined,
    categoryId: data.categoryId || undefined,
    status: data.status,
    contacts: data.contacts.map((contact) => ({
      type: contact.type,
      value: contact.value.trim(),
    })),
    portfolio: portfolio.length > 0 ? portfolio : undefined,
  };
}

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  route: UploadRoute;
  aspectRatio?: 'video' | 'square';
}

function ImageUpload({ label, value, onChange, route, aspectRatio = 'video' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleUpload(file: File) {
    setUploading(true);
    setFeedback('idle');

    try {
      const [result] = await uploadFiles(route, { files: [file] });
      onChange(result.url);
      setFeedback('success');
      setTimeout(() => setFeedback('idle'), 2500);
    } catch {
      setFeedback('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <button
        type="button"
        className={cn(
          'group relative w-full overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200',
          value ? 'border-border' : 'border-muted-foreground/20 hover:border-primary/50'
        )}
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
      >
        {value ? (
          <div
            className={cn('relative', aspectRatio === 'video' ? 'aspect-video' : 'aspect-square')}
          >
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
              <Camera className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-8',
              aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'
            )}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">
              {uploading ? 'Subiendo...' : 'Hacé clic para subir'}
            </span>
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : null}
        {feedback === 'success' ? (
          <div className="absolute right-2 top-2 rounded-full bg-emerald-500 p-1 text-white">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        ) : null}
        {feedback === 'error' ? (
          <div className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
          </div>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
          event.target.value = '';
        }}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-destructive hover:text-destructive"
          onClick={() => onChange('')}
        >
          Eliminar imagen
        </Button>
      ) : null}
    </div>
  );
}

interface PortfolioUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function PortfolioUpload({ images, onChange }: PortfolioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      const [result] = await uploadFiles('serviceImages', { files: [file] });
      onChange([...images, result.url]);
    } catch {
      toast.error('No pudimos subir la imagen');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium leading-none">Portfolio ({images.length}/4)</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= 4}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Agregar imagen
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={url}
              alt={`Portfolio ${index + 1}`}
              fill
              className="object-cover"
              sizes="180px"
            />
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
              onClick={() => onChange(images.filter((image) => image !== url))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {images.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Todavía no agregaste imágenes de portfolio.
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}

export function EditarServicioContent({ id }: EditarServicioContentProps) {
  const [activeStep, setActiveStep] = useState<(typeof STEPS)[number]['id']>('general');
  const serviceQuery = useServiceDetail(id);
  const categoriasQuery = useCategoriasServicio();
  const ubicacionesQuery = useUbicaciones();
  const updateMutation = useUpdateService(id);

  const form = useForm<CrearServicioFormValues>({
    resolver: zodResolver(CrearServicioSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  useEffect(() => {
    if (serviceQuery.data) form.reset(toFormValues(serviceQuery.data));
  }, [form, serviceQuery.data]);

  if (serviceQuery.isLoading || categoriasQuery.isLoading || ubicacionesQuery.isLoading) {
    return <EditarServicioSkeleton />;
  }

  if (serviceQuery.isError) {
    return (
      <EditarServicioError
        message={
          serviceQuery.error instanceof Error ? serviceQuery.error.message : 'Error desconocido.'
        }
        onRetry={() => serviceQuery.refetch()}
      />
    );
  }

  if (categoriasQuery.isError || ubicacionesQuery.isError) {
    return (
      <EditarServicioError
        message="No pudimos cargar catálogos necesarios para editar el servicio."
        onRetry={() => {
          categoriasQuery.refetch();
          ubicacionesQuery.refetch();
        }}
      />
    );
  }

  if (!serviceQuery.data) return <EditarServicioEmpty />;

  const categorias = categoriasQuery.data ?? [];
  const ubicaciones = ubicacionesQuery.data ?? [];
  const bannerUrl = form.watch('bannerUrl') ?? '';
  const logoUrl = form.watch('logoUrl') ?? '';
  const thumbnailUrl = form.watch('thumbnailUrl') ?? '';
  const serviceImages = form.watch('serviceImages') ?? [];

  function handleStepClick(stepId: (typeof STEPS)[number]['id']) {
    setActiveStep(stepId);
    document.getElementById(stepId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleSubmit(data: CrearServicioFormValues) {
    updateMutation.mutate(buildPayload(data), {
      onSuccess: () => toast.success('Servicio actualizado correctamente'),
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'No pudimos actualizar el servicio');
      },
    });
  }

  return (
    <Form {...form}>
      <section className="min-h-screen bg-background px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
        >
          <aside className="space-y-6">
            <div>
              <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                <Link href="/user/publicaciones">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Editar servicio</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajustá la información que ve el público en el detalle del servicio.
              </p>
            </div>
            <div className="sticky top-24 space-y-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200',
                    activeStep === step.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                  onClick={() => handleStepClick(step.id)}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      activeStep === step.id
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step.number}
                  </span>
                  <span className="text-sm font-medium">{step.label}</span>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {updateMutation.isError ? (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  {updateMutation.error instanceof Error
                    ? updateMutation.error.message
                    : 'Error al actualizar el servicio.'}
                </span>
              </div>
            ) : null}

            <Card id="general" className="scroll-mt-24">
              <CardContent className="space-y-6 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    01 Información general
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    Identidad del servicio
                  </h2>
                </div>

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

                <div className="grid gap-4 md:grid-cols-2">
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
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccioná una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categorias.map((category) => (
                              <SelectItem key={category.id} value={category.id ?? ''}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describí tu servicio, experiencia y forma de trabajo."
                          className="min-h-[130px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ImageUpload
                    label="Banner"
                    value={bannerUrl}
                    onChange={(url) => form.setValue('bannerUrl', url)}
                    route="serviceBanner"
                  />
                  <ImageUpload
                    label="Logo"
                    value={logoUrl}
                    onChange={(url) => form.setValue('logoUrl', url)}
                    route="serviceThumbnail"
                    aspectRatio="square"
                  />
                  <ImageUpload
                    label="Thumbnail"
                    value={thumbnailUrl}
                    onChange={(url) => form.setValue('thumbnailUrl', url)}
                    route="serviceThumbnail"
                    aspectRatio="square"
                  />
                </div>
                <PortfolioUpload
                  images={serviceImages}
                  onChange={(images) => form.setValue('serviceImages', images)}
                />
              </CardContent>
            </Card>

            <Card id="details" className="scroll-mt-24">
              <CardContent className="space-y-6 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    02 Detalles
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    Disponibilidad, precio y estado
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años de experiencia</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="paused">Pausado</SelectItem>
                            <SelectItem value="archived">Archivado</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccioná disponibilidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">Inmediata</SelectItem>
                            <SelectItem value="not_immediate">No inmediata</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modalidad</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccioná modalidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in_person">Presencial</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="hybrid">Híbrida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="availabilityDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalle de disponibilidad</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[90px] resize-none"
                          placeholder="Ej: Disponible fines de semana."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="priceMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio mínimo ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="50000" {...field} />
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
                        <FormLabel>Precio máximo ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="200000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card id="contact" className="scroll-mt-24">
              <CardContent className="space-y-6 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    03 Contacto
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    Ubicación y canales
                  </h2>
                </div>

                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una ubicación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ubicaciones.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name} ({location.region.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <label className="text-sm font-medium leading-none">Datos de contacto</label>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)_2.5rem]"
                    >
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.type`}
                        render={({ field: contactTypeField }) => (
                          <FormItem>
                            <Select
                              value={contactTypeField.value}
                              onValueChange={contactTypeField.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CONTACT_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
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
                        render={({ field: contactValueField }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Valor" {...contactValueField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="self-start"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ type: 'email', value: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar contacto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link href="/user/publicaciones">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-brand text-white hover:bg-brand/90"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Guardar cambios
              </Button>
            </div>
          </form>
        </motion.div>
      </section>
    </Form>
  );
}
