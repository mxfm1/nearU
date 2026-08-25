'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  AlertCircle,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  UserRound,
} from 'lucide-react';
import type { ServicioDetalle } from '@/types/contracts/services';
import type { Profile } from '@/lib/profile-api';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/app/(auth)/auth/login/_components/login-dialog';
import { cn } from '@/lib/utils';
import {
  getProviderInitial,
  getProviderName,
  getSafeContacts,
  formatModality,
  type SafeContact,
} from './service-detail-utils';
import { ServiceContactDialog } from './service-contact-dialog';

interface ServiceDetailSidebarProps {
  service: ServicioDetalle;
  currentUserId?: string;
  authPending: boolean;
  myProfile?: Profile;
  profilePending: boolean;
  profileError: boolean;
  onRetryProfile: () => void;
}

const CONTACT_ICONS: Record<string, typeof Mail> = {
  email: Mail,
  telefono: Phone,
  phone: Phone,
  whatsapp: MessageCircle,
  website: Globe,
  instagram: ExternalLink,
  facebook: ExternalLink,
  twitter: ExternalLink,
};

export function ServiceDetailSidebar({
  service,
  currentUserId,
  authPending,
  myProfile,
  profilePending,
  profileError,
  onRetryProfile,
}: ServiceDetailSidebarProps) {
  const providerName = getProviderName(service);
  const contacts = getSafeContacts(service.contacts);
  const modality = formatModality(service.modality);
  const isOwnContent = !!myProfile?.id && myProfile.id === service.profileId;
  const slug = service.slug ?? service.id ?? '';

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="lg:sticky lg:top-20">
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Acción de contacto
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Solicitá una cotización</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Contale al proveedor qué necesitás y adjuntá referencias para acelerar la respuesta.
          </p>

          <div className="mt-5">{renderContactAction()}</div>
        </div>

        <div className="border-t p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-lg font-bold text-primary">
              {service.logoUrl ? (
                <Image src={service.logoUrl} alt="" fill className="object-cover" sizes="48px" />
              ) : (
                getProviderInitial(providerName)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-wide text-primary">
                {providerName}
              </p>
              <p className="text-sm text-muted-foreground">Proveedor del servicio</p>
            </div>
          </div>
        </div>
      </section>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Canales disponibles
        </h2>

        {contacts.length > 0 ? (
          <div className="mt-4 space-y-3">
            {contacts.map((contact) => (
              <ContactRow key={`${contact.type}-${contact.value}`} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Este proveedor todavía no publicó canales directos. Usá la solicitud de cotización.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-3 border-t pt-5 text-sm">
          {service.category?.name && <DetailRow label="Categoría" value={service.category.name} />}
          {modality && <DetailRow label="Modalidad" value={modality} />}
          {service.location?.name && <DetailRow label="Ubicación" value={service.location.name} />}
        </div>
      </section>
    </motion.aside>
  );

  function renderContactAction() {
    if (authPending) {
      return (
        <Button className="w-full" size="lg" disabled>
          Cargando sesión...
        </Button>
      );
    }

    if (!currentUserId) {
      return (
        <LoginDialog>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Solicitar cotización
          </Button>
        </LoginDialog>
      );
    }

    if (profilePending) {
      return (
        <Button className="w-full" size="lg" disabled>
          Verificando perfil...
        </Button>
      );
    }

    if (profileError) {
      return (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p>No pudimos verificar si este servicio es tuyo.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onRetryProfile} className="mt-3 w-full">
            Reintentar verificación
          </Button>
        </div>
      );
    }

    if (isOwnContent) {
      return (
        <Button className="w-full" size="lg" disabled title="No podés contactarte a vos mismo">
          Tu propia publicación
        </Button>
      );
    }

    return (
      <ServiceContactDialog slug={slug}>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          Solicitar cotización
        </Button>
      </ServiceContactDialog>
    );
  }
}

function ContactRow({ contact }: { contact: SafeContact }) {
  const Icon = CONTACT_ICONS[contact.type] ?? BriefcaseBusiness;
  const className =
    'flex items-start gap-3 rounded-xl bg-muted/40 p-3 text-left text-sm hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
  const content = (
    <>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{contact.label}</span>
        <span className="block break-all font-medium text-foreground">{contact.value}</span>
      </span>
    </>
  );

  if (contact.href) {
    return (
      <a
        href={contact.href}
        target={contact.href.startsWith('http') ? '_blank' : undefined}
        rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={cn(className, 'w-full')}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
