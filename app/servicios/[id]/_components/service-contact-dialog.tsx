'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplyForm } from '@/components/forms/apply-form';

interface ServiceContactDialogProps {
  slug: string;
  children: ReactNode;
}

export function ServiceContactDialog({ slug, children }: ServiceContactDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Contactar proveedor</DialogTitle>
          <DialogDescription>Completá el formulario para enviar tu solicitud.</DialogDescription>
        </DialogHeader>
        <ApplyForm slug={slug} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
