'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { CrearEventoSchema, type CrearEventoFormValues } from '@/components/forms/schemas';
import { generateSlug } from '@/lib/slug';
import { cn } from '@/lib/utils';
import { SingleImageUpload } from './single-image-upload';
import type { Categoria, Region } from '@/lib/catalogo-api';
import type { CreateEventoPayload } from '@/types/contracts/event';

interface CrearEventoFormProps {
  categorias: Categoria[];
  categoriasLoading: boolean;
  regiones: Region[];
  regionesLoading: boolean;
  mutation: ReturnType<typeof import('@/hooks/evento/evento-mutations').useCreateEvento>;
  onSuccess?: (evento: { id: string }) => void;
}

const sections = [
  { id: 'general', label: 'General' },
  { id: 'event', label: 'Evento' },
  { id: 'requirements', label: 'Requisitos' },
] as const;

export function CrearEventoForm({
  categorias,
  categoriasLoading,
  regiones,
  regionesLoading,
  mutation,
  onSuccess,
}: CrearEventoFormProps) {
  const [activeSection, setActiveSection] = useState('general');
  const [selectedRegionId, setSelectedRegionId] = useState('');

  const selectedRegion = useMemo(
    () => regiones.find((r) => r.id === selectedRegionId),
    [regiones, selectedRegionId]
  );

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
  });

  const watchedTitle = form.watch('title');

  useEffect(() => {
    if (watchedTitle) {
      const slug = generateSlug(watchedTitle);
      form.setValue('slug', slug, { shouldValidate: slug.length >= 2 });
    }
  }, [watchedTitle, form]);

  function buildPayload(data: CrearEventoFormValues): CreateEventoPayload {
    return {
      slug: data.slug || generateSlug(data.title),
      title: data.title,
      description: data.description || undefined,
      applicationDeadline: data.applicationDeadline || undefined,
      requiredCandidates: data.requiredCandidates,
      requiresVerifiedProfile: data.requiresVerifiedProfile,
      autoCloseWhenFilled: data.autoCloseWhenFilled,
      requirements: data.requirements || undefined,
      categoryId: data.categoryId || undefined,
      locationId: data.locationId || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      bannerUrl: data.bannerUrl || undefined,
      eventStatus: data.eventStatus,
    };
  }

  function handleFormSubmit(data: CrearEventoFormValues) {
    mutation.mutate({ ...buildPayload(data), eventStatus: 'published' } as never);
  }

  function handleSaveDraft() {
    form.handleSubmit((data) => {
      mutation.mutate({ ...buildPayload(data), eventStatus: 'draft' } as never);
    })();
  }

  function handleSectionClick(sectionId: string) {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const thumbnailUrl = form.watch('thumbnailUrl') ?? '';
  const bannerUrl = form.watch('bannerUrl') ?? '';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-10">
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
                      <span className="h-3 w-3 text-muted-foreground flex-shrink-0">i</span>
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
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                          }
                        />
                      </motion.div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">Personas a seleccionar</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Región</label>
                <Select
                  onValueChange={(value) => {
                    setSelectedRegionId(value);
                    form.setValue('locationId', '');
                  }}
                  value={selectedRegionId}
                  disabled={regionesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={regionesLoading ? 'Cargando...' : 'Seleccioná una región'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {regiones.map((r) => (
                      <SelectItem key={r.id} value={r.id || ''}>
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
                          <SelectItem key={loc.id} value={loc.id || ''}>
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
          </div>
        </motion.div>

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

        {mutation.isError && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm card-base border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Error al crear el evento.'}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none rounded-xl"
            disabled={mutation.isPending}
            onClick={handleSaveDraft}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar como borrador'
            )}
          </Button>
          <Button
            type="submit"
            className="flex-1 sm:flex-none rounded-xl"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar evento'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
