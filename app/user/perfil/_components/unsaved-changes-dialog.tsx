'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface UnsavedChangesDialogProps {
  open: boolean
  dirtyFields: string[]
  onConfirm: () => void
  onCancel: () => void
}

const FIELD_LABELS: Record<string, string> = {
  bannerUrl: 'Banner',
  logoUrl: 'Logo',
  name: 'Nombre de la empresa',
  industry: 'Rubro / Industria',
  description: 'Descripción',
  tags: 'Etiquetas / Keywords',
  location: 'Ubicación',
  founded: 'Año de fundación',
  employees: 'Tamaño de la empresa',
  website: 'Sitio web',
  whatsapp: 'WhatsApp',
  socialLinks: 'Redes sociales',
}

export function UnsavedChangesDialog({
  open,
  dirtyFields,
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Tienes cambios sin guardar en las siguientes secciones:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ul className="space-y-1 text-sm">
          {dirtyFields.map((field) => (
            <li key={field} className="flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              {FIELD_LABELS[field] ?? field}
            </li>
          ))}
        </ul>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Seguir editando</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            Salir sin guardar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
