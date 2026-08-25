'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Camera,
  ImageIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { eventosApi, type UpdateEventoPayload } from '@/lib/eventos-api';
import { catalogoApi } from '@/lib/catalogo-api';
import { uploadFiles } from '@/lib/uploadthing';
import { generateSlug } from '@/lib/slug';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

// ── Schema ──

const EditarEventoSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  slug: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  requirements: z
    .string()
    .max(5000, 'Los requisitos no pueden superar los 5000 caracteres')
    .optional()
    .or(z.literal('')),
  startAt: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  locationId: z.string().optional().or(z.literal('')),
  thumbnailUrl: z.string().optional().or(z.literal('')),
  eventStatus: z.enum(['draft', 'published', 'paused', 'archived']),
});

type EditarEventoFormValues = z.infer<typeof EditarEventoSchema>;

// ── Image Upload ──

interface SingleUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  route: 'eventThumbnail';
  aspectRatio?: string;
}

function SingleImageUpload({
  label,
  value,
  onChange,
  route,
  aspectRatio = '16:9',
}: SingleUploadProps) {
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

// ── Main component ──

interface EditarEventoContentProps {
  id: string;
}

export function EditarEventoContent({ id }: EditarEventoContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRegionId, setSelectedRegionId] = useState('');

  // ── Queries ──

  const {
    data: eventoData,
    isLoading: eventoLoading,
    isError: eventoError,
    error: eventoErrorObj,
  } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosApi.getById(id),
    enabled: !!id,
  });

  const { data: categoriasRes } = useQuery({
    queryKey: ['categorias', 'event'],
    queryFn: () => catalogoApi.categorias('event'),
  });

  const { data: regionesRes } = useQuery({
    queryKey: ['regiones'],
    queryFn: () => catalogoApi.regiones(),
  });

  const categorias = categoriasRes?.data ?? [];
  const regiones = regionesRes?.data ?? [];

  const selectedRegion = useMemo(
    () => regiones.find((r) => r.id === selectedRegionId),
    [regiones, selectedRegionId]
  );

  const evento = eventoData?.data ?? null;

  // ── Form defaults from API data ──

  const defaultValues = useMemo((): EditarEventoFormValues => {
    if (!evento) {
      return {
        title: '',
        slug: '',
        description: '',
        requirements: '',
        startAt: '',
        categoryId: '',
        locationId: '',
        thumbnailUrl: '',
        eventStatus: 'draft',
      };
    }

    const validStatuses = ['draft', 'published', 'paused', 'archived'];
    const backendStatus = (evento as any).status?.slug || (evento as any).eventStatus || 'draft';
    const eventStatus = validStatuses.includes(backendStatus) ? backendStatus : 'draft';

    return {
      title: evento.title ?? '',
      slug: evento.slug ?? '',
      description: evento.description ?? '',
      requirements: evento.requirements ?? '',
      startAt: evento.startAt ?? '',
      categoryId: evento.category?.id ?? '',
      locationId: evento.location?.id ?? '',
      thumbnailUrl: evento.thumbnailUrl ?? '',
      eventStatus,
    };
  }, [evento]);

  // ── Form ──

  const form = useForm<EditarEventoFormValues>({
    resolver: zodResolver(EditarEventoSchema),
    defaultValues,
    values: defaultValues,
  });

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const subscription = form.watch(() => setIsDirty(true));
    return () => subscription.unsubscribe();
  }, [form]);

  // Sync region from locationId
  useEffect(() => {
    const locId = form.watch('locationId');
    if (locId) {
      for (const reg of regiones) {
        if (reg.locations?.some((l) => l.id === locId)) {
          setSelectedRegionId(reg.id ?? '');
          return;
        }
      }
    }
  }, [form, regiones]);

  // ── Mutation ──

  const mutation = useMutation({
    mutationFn: (payload: UpdateEventoPayload) => eventosApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evento', id] });
      queryClient.invalidateQueries({ queryKey: ['mis-eventos'] });
      setIsDirty(false);
    },
  });

  // ── Handlers ──

  function buildPayload(data: EditarEventoFormValues): UpdateEventoPayload {
    return {
      slug: data.slug || generateSlug(data.title),
      title: data.title,
      description: data.description || undefined,
      requirements: data.requirements ?? '',
      startAt: data.startAt || undefined,
      categoryId: data.categoryId || undefined,
      locationId: data.locationId || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      eventStatus: data.eventStatus,
    };
  }

  function handleSubmit(data: EditarEventoFormValues) {
    mutation.mutate(buildPayload(data));
  }

  const thumbnailUrl = form.watch('thumbnailUrl') ?? '';

  // ── Render ──

  // Loading
  if (eventoLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
          <p className="text-sm text-muted-foreground">Cargando evento...</p>
        </div>
      </div>
    );
  }

  // Error loading
  if (eventoError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error al cargar</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {eventoErrorObj instanceof Error
              ? eventoErrorObj.message
              : 'No se pudo cargar el evento.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
            <Button
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => router.refresh()}
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!evento) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Evento no encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            El evento que buscás no existe o fue eliminado.
          </p>
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/user/publicaciones">Volver a mis publicaciones</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isSaving = mutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/user/publicaciones">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Editar evento</h1>
              <p className="text-sm text-muted-foreground mt-1">{evento.title}</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/user/publicaciones/evento/${id}/aplicaciones`}>Ver aplicaciones</Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Error banner */}
            {mutation.isError && (
              <div className="flex items-center gap-2 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  {mutation.error instanceof Error ? mutation.error.message : 'Error al guardar.'}
                </span>
              </div>
            )}

            {/* Success banner */}
            {mutation.isSuccess && (
              <div className="flex items-center gap-2 p-4 rounded-md bg-emerald-500/10 text-emerald-600 text-sm">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Cambios guardados correctamente.</span>
              </div>
            )}

            {/* ── Section 1: Info General ── */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Información general</h2>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Conferencia de Innovación 2026" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y hora del evento</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
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
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requisitos del evento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describí los requisitos que deben cumplir los postulantes..."
                          className="min-h-[120px] resize-none"
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
              </CardContent>
            </Card>

            {/* ── Section 2: Categoría y Ubicación ── */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Categoría y ubicación</h2>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id ?? ''}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Región</label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedRegionId(value);
                        form.setValue('locationId', '');
                      }}
                      value={selectedRegionId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una región" />
                      </SelectTrigger>
                      <SelectContent>
                        {regiones.map((r) => (
                          <SelectItem key={r.id} value={r.id ?? ''}>
                            {r.name}
                          </SelectItem>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedRegionId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedRegionId
                                    ? 'Primero elegí región'
                                    : 'Seleccioná una ubicación'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedRegion?.locations?.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id ?? ''}>
                                {loc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Event Status */}
                <FormField
                  control={form.control}
                  name="eventStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del evento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">No Visible</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="paused">Pausado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ── Section 3: Portada ── */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Portada</h2>

                <SingleImageUpload
                  label="Portada del evento"
                  value={thumbnailUrl}
                  onChange={(url) => form.setValue('thumbnailUrl', url)}
                  route="eventThumbnail"
                  aspectRatio="16:9"
                />
              </CardContent>
            </Card>

            {/* ── Action buttons ── */}
            <div className="flex items-center justify-between gap-3 pt-2 pb-8">
              <div className="text-sm text-muted-foreground">
                {mutation.isError && (
                  <span className="text-destructive">
                    Error:{' '}
                    {mutation.error instanceof Error ? mutation.error.message : 'Error desconocido'}
                  </span>
                )}
                {mutation.isSuccess && (
                  <span className="text-emerald-600">✓ Cambios guardados</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/user/publicaciones">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-brand hover:bg-brand/90 text-white min-w-[140px]"
                  disabled={!isDirty || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar cambios'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
