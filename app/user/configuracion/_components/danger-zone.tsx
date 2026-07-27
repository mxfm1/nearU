'use client';

import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { authApi, User } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CONFIRMATION_TEXT = 'confirmar';

interface DangerZoneProps {
  user: User;
}

export function DangerZone({ user }: DangerZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  const canDelete = confirmation.toLowerCase() === CONFIRMATION_TEXT;

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      await authApi.deleteUser(user.id);
      logout();
      toast.success('Cuenta eliminada exitosamente');
      setOpen(false);
      router.push('/');
    } catch {
      toast.error('Ocurrió un error inesperado. Intentalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-destructive mb-1">Zona de Peligro</h2>
      <p className="text-sm text-muted-foreground mb-4">Acciones irreversibles sobre tu cuenta.</p>

      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Borrar Cuenta</p>
              <p className="text-sm text-muted-foreground mb-4">
                Una vez eliminada la cuenta, no habrá marcha atrás. Se perderán todos tus eventos y
                datos personales.
              </p>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Borrar Cuenta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-2">
                      Esta acción es irreversible. Se eliminarán permanentemente tu cuenta, eventos
                      y datos personales.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Escribí{' '}
                      <span className="font-semibold text-foreground">
                        &quot;{CONFIRMATION_TEXT}&quot;
                      </span>{' '}
                      para confirmar:
                    </p>
                    <Input
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      placeholder={CONFIRMATION_TEXT}
                      disabled={isLoading}
                    />
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      className="bg-destructive hover:bg-destructive/90"
                      disabled={!canDelete || isLoading}
                      onClick={handleDeleteAccount}
                    >
                      {isLoading ? 'Eliminando...' : 'Eliminar cuenta'}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
