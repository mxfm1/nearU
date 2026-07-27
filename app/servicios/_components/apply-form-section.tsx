import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplyForm } from '@/components/forms/apply-form';
import { ReactNode } from 'react';

interface ApplyFormSectionProps {
  children: ReactNode;
  slug: string;
}

export default function ApplyFormSection({ children, slug }: ApplyFormSectionProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Contactar proveedor</DialogTitle>
          <DialogDescription>Completá el formulario para enviar tu solicitud.</DialogDescription>
        </DialogHeader>
        <div className="max-w-full">
          <ApplyForm slug={slug} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
