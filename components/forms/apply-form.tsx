'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Loader2, File, Image, X, Upload } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { ApplyFormValues, ApplySchema } from './schemas'
import { contactosApi } from '@/lib/contactos-api'
import { catalogoApi } from '@/lib/catalogo-api'
import { uploadFiles } from '@/lib/uploadthing'

interface AttachmentItem {
  url: string
  name: string
  size: number
  type: 'image' | 'pdf'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface ApplyFormProps {
  slug: string
  onSuccess?: () => void
}

export const ApplyForm = ({ slug, onSuccess }: ApplyFormProps) => {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const { data: intencionesRes, isLoading: intencionesLoading } = useQuery({
    queryKey: ['intenciones'],
    queryFn: () => catalogoApi.intenciones(),
  })

  const intenciones = intencionesRes?.data ?? []

  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(ApplySchema),
    defaultValues: {
      intencion: undefined,
      mensaje: '',
      attachments: [],
    },
  })

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof contactosApi.create>[0]) =>
      contactosApi.create(payload),
    onSuccess: () => {
      toast.success('Solicitud enviada correctamente')
      form.reset()
      setAttachments([])
      onSuccess?.()
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al enviar la solicitud')
    },
  })

  const handleFormSubmit = (data: ApplyFormValues) => {
    mutation.mutate({
      slug,
      intencion: data.intencion,
      mensaje: data.mensaje,
      attachments: attachments.length > 0 ? attachments.map((a) => a.url) : undefined,
    })
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    route: 'contactAttachment' | 'contactAttachmentDoc',
    type: 'image' | 'pdf',
    setUploading: (v: boolean) => void,
  ) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const remaining = 6 - attachments.length
    if (files.length > remaining) {
      toast.error(`Solo podés subir ${remaining} archivo${remaining !== 1 ? 's' : ''} más`)
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const res = await uploadFiles(route, { files })
      const newItems: AttachmentItem[] = res.map((r) => ({
        url: r.url,
        name: r.name ?? r.url.split('/').pop() ?? 'archivo',
        size: r.size ?? 0,
        type,
      }))
      setAttachments((prev) => [...prev, ...newItems])
      form.setValue('attachments', [...attachments, ...newItems].map((a) => a.url))
      toast.success(`${files.length} archivo${files.length > 1 ? 's' : ''} subido${files.length > 1 ? 's' : ''}`)
    } catch {
      toast.error('Error al subir archivos')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((a) => a.url !== url))
    form.setValue(
      'attachments',
      attachments.filter((a) => a.url !== url).map((a) => a.url),
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="intencion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intención</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ''}
                disabled={intencionesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        intencionesLoading
                          ? 'Cargando...'
                          : 'Selecciona una intención'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intenciones.map((intencion) => (
                    <SelectItem key={intencion} value={intencion}>
                      {intencion}
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
          name="mensaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos qué necesitas..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-zinc-400">
                Este mensaje será enviado directamente al proveedor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments */}
        <div className="space-y-3">
          <Label className="text-sm font-medium leading-none">
            Archivos adjuntos
          </Label>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((item) => (
                <div
                  key={item.url}
                  className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.type === 'image' ? (
                      <Image className="h-5 w-5 shrink-0 text-muted-foreground" />
                    ) : (
                      <File className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(item.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(item.url)}
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {attachments.length < 6 && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingImage || uploadingPdf}
                className="relative"
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Image className="h-4 w-4 mr-2" />
                )}
                {uploadingImage ? 'Subiendo...' : 'Imagen'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'contactAttachment', 'image', setUploadingImage)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingImage || uploadingPdf}
                />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingImage || uploadingPdf}
                className="relative"
              >
                {uploadingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <File className="h-4 w-4 mr-2" />
                )}
                {uploadingPdf ? 'Subiendo...' : 'Documento'}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  onChange={(e) => handleFileUpload(e, 'contactAttachmentDoc', 'pdf', setUploadingPdf)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploadingImage || uploadingPdf}
                />
              </Button>

              <span className="text-xs text-muted-foreground">
                {attachments.length}/6
              </span>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            'Enviar solicitud'
          )}
        </Button>
      </form>
    </Form>
  )
}
