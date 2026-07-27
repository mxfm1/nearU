'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Camera,
  X,
  ImageIcon,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CrearServicioSchema, type CrearServicioFormValues } from '@/components/forms/schemas';
import { generateSlug } from '@/lib/slug';
import { cn } from '@/lib/utils';
import { uploadFiles } from '@/lib/uploadthing';
import type { Categoria } from '@/lib/catalogo-api';
import type { CreateServicioPayload } from '@/lib/servicios-api';

interface ServicioUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  route: 'serviceBanner' | 'serviceThumbnail';
  aspectRatio?: string;
}

function ServicioImageUpload({
  label,
  value,
  onChange,
  route,
  aspectRatio = '16:9',
}: ServicioUploadProps) {
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
      setTimeout(() => setFeedback('idle'), 3000);
    } catch {
      setFeedback('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div
        className={cn(
          'relative rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200',
          'group cursor-pointer',
          value ? 'border-border' : 'border-muted-foreground/20 hover:border-primary/50'
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <div
            className={cn(
              'relative overflow-hidden',
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
            )}
          >
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-8',
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
            )}
          >
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
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>
      {value && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            Imagen subida
          </span>
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
  );
}

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

function ServicioMultiImageUpload({ images, onChange, max = 4 }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleUpload(file: File) {
    setUploading(true);
    setFeedback('idle');
    try {
      const [result] = await uploadFiles('serviceImages', { files: [file] });
      onChange([...images, result.url]);
      setFeedback('success');
      setTimeout(() => setFeedback('idle'), 3000);
    } catch {
      setFeedback('error');
    } finally {
      setUploading(false);
    }
  }

  const canAdd = images.length < max;

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
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border border-border group"
          >
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
                : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
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
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

interface CrearServicioFormProps {
  categorias: Categoria[];
  categoriasLoading: boolean;
  ubicaciones: { id: string; name: string; region: { id: string; name: string; slug: string } }[];
  ubicacionesLoading: boolean;
  mutation: ReturnType<typeof import('@/hooks/services/service-mutations').useCreateService>;
}

const steps = [
  { id: 'brand-essentials', label: 'Información General', number: '01' },
  { id: 'portfolio-narrative', label: 'Detalles del servicio', number: '02' },
  { id: 'service-details', label: 'Contacto', number: '03' },
];

export function CrearServicioForm({
  categorias,
  categoriasLoading,
  ubicaciones,
  ubicacionesLoading,
  mutation,
}: CrearServicioFormProps) {
  const [activeStep, setActiveStep] = useState('brand-essentials');

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
  });

  const watchedTitle = form.watch('title');

  useEffect(() => {
    if (watchedTitle) {
      const slug = generateSlug(watchedTitle);
      form.setValue('slug', slug, { shouldValidate: slug.length >= 2 });
    }
  }, [watchedTitle, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  function buildPayload(data: CrearServicioFormValues): CreateServicioPayload {
    const portfolioImages: { url: string; title: string; description: string }[] = (
      data.serviceImages ?? []
    ).map((url) => ({
      url,
      title: '',
      description: '',
    }));

    const contacts = data.contacts?.filter((c) => c.value.trim()) ?? [];

    return {
      slug: data.slug || generateSlug(data.title),
      title: data.title,
      marca: data.marca || undefined,
      description: data.description || undefined,
      yearsExperience: data.yearsExperience ? Number(data.yearsExperience) : undefined,
      priceMin: data.priceMin ? Number(data.priceMin) : undefined,
      priceMax: data.priceMax ? Number(data.priceMax) : undefined,
      availability: data.availability || undefined,
      contacts: contacts.length > 0 ? contacts : undefined,
      categoryId: data.categoryId || undefined,
      locationId: data.locationId || undefined,
      bannerUrl: data.bannerUrl || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      portfolio: portfolioImages.length > 0 ? portfolioImages : undefined,
      status: data.status,
    };
  }

  function handleFormSubmit(data: CrearServicioFormValues) {
    mutation.mutate({ ...buildPayload(data), status: 'published' } as never);
  }

  function handleSaveDraft() {
    const data = form.getValues();
    mutation.mutate({ ...buildPayload(data), status: 'draft' } as never);
  }

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
    document.getElementById(stepId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bannerUrl = form.watch('bannerUrl') ?? '';
  const thumbnailUrl = form.watch('thumbnailUrl') ?? '';
  const serviceImages = form.watch('serviceImages') ?? [];

  const contactTypes = [
    { value: 'email', label: 'Correo' },
    { value: 'telefono', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'website', label: 'Sitio web' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'X' },
  ] as const;

  return (
    <Form {...form}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Crear servicio</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Completa los datos de tu servicio para publicarlo en el directorio de proveedores.
                </p>
              </div>
              <div className="space-y-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200',
                      activeStep === step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
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
            </div>
          </div>

          <div className="flex-1">
            {mutation.isError && (
              <div className="flex items-center gap-2 p-4 mb-6 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'Error al crear el servicio.'}
                </span>
              </div>
            )}

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
              <div className="space-y-6">
                <h2
                  id="brand-essentials"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3"
                >
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={categoriasLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  categoriasLoading ? 'Cargando...' : 'Seleccioná una categoría'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categorias.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id || ''}>
                                {cat.name}
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
                          placeholder="Describí tu servicio, experiencia, metodología de trabajo..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ServicioImageUpload
                    label="Banner del servicio"
                    value={bannerUrl}
                    onChange={(url) => form.setValue('bannerUrl', url)}
                    route="serviceBanner"
                    aspectRatio="16:9"
                  />
                  <ServicioImageUpload
                    label="Thumbnail"
                    value={thumbnailUrl}
                    onChange={(url) => form.setValue('thumbnailUrl', url)}
                    route="serviceThumbnail"
                    aspectRatio="1:1"
                  />
                </div>

                <ServicioMultiImageUpload
                  images={serviceImages}
                  onChange={(imgs) => form.setValue('serviceImages', imgs)}
                  max={4}
                />
              </div>

              <div className="space-y-6">
                <h2
                  id="portfolio-narrative"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3"
                >
                  02 Detalles del servicio
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años de experiencia</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} />
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
                          <Input placeholder="Inmediata, Fines de semana..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priceMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio mínimo ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50000" {...field} />
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
                          <Input type="number" placeholder="200000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2
                  id="service-details"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-3"
                >
                  03 Información de contacto
                </h2>

                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={ubicacionesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                ubicacionesLoading ? 'Cargando...' : 'Seleccioná una ubicación'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ubicaciones.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id || ''}>
                              {loc.name} ({loc.region.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <label className="text-sm font-medium">Datos de contacto</label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Select
                        defaultValue={field.type}
                        onValueChange={(value) => {
                          const contacts = form.getValues('contacts');
                          contacts[index].type = value as typeof field.type;
                          form.setValue('contacts', contacts);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contactTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Valor"
                        value={field.value}
                        onChange={(e) => {
                          const contacts = form.getValues('contacts');
                          contacts[index].value = e.target.value;
                          form.setValue('contacts', contacts);
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
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
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar contacto
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Guardar como borrador
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Publicar servicio
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Form>
  );
}
