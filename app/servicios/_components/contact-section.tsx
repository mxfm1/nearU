'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Globe, Camera, ExternalLink, X, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import type { ContactInfo } from '@/lib/servicios-api';
import { profileApi } from '@/lib/profile-api';
import { useAuth } from '@/hooks/use-auth';
import ApplyFormSection from './apply-form-section';
import { LoginDialog } from '@/app/(auth)/auth/login/_components/login-dialog';

interface ContactSectionProps {
  contactInformation: ContactInfo[];
  profileId: string;
  slug: string;
}

const contactIcons: Record<ContactInfo['type'], typeof Mail> = {
  email: Mail,
  telefono: Phone,
  whatsapp: MessageCircle,
  website: Globe,
  instagram: Camera,
  facebook: ExternalLink,
  twitter: X,
};

const labels: Record<ContactInfo['type'], string> = {
  email: 'Correo',
  telefono: 'Teléfono',
  whatsapp: 'WhatsApp',
  website: 'Sitio web',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
};

export function ContactSection({ contactInformation, profileId, slug }: ContactSectionProps) {
  const { user } = useAuth();

  const { data: myProfile } = useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn: () => profileApi.getByUserId(user!.id),
    enabled: !!user?.id,
    select: (res) => res.data,
  });

  const isOwnContent = !!myProfile && myProfile.id === profileId;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
    rounded-md
    border
    bg-background
    shadow-sm
    overflow-hidden
  "
    >
      <div className="p-6">
        <h2 className="font-semibold text-lg sm:text-xl md:text-2xl text-center ">
          Vías de contacto
        </h2>
      </div>

      <div className="border-t px-6 py-5">
        {/* <h4 className="text-sm font-medium mb-4">
          Canales de contacto
        </h4> */}

        <div className="space-y-4">
          {(contactInformation ?? []).map((contact, index) => {
            const Icon = contactIcons[contact.type];

            return (
              <div
                key={index}
                className="
              flex items-start gap-3
            "
              >
                <Icon className="h-4 w-4 mt-1 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground capitalize">{contact.type}</p>

                  <p className="text-sm font-medium break-all">{contact.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {user ? (
          <ApplyFormSection slug={slug}>
            <Button
              className="w-full mt-6 hover:cursor-pointer"
              size="lg"
              disabled={isOwnContent}
              title={isOwnContent ? 'No podés contactarte a vos mismo' : 'Solicitar cotización'}
            >
              {isOwnContent ? 'Tu propia publicación' : 'Solicitar cotización'}
            </Button>
          </ApplyFormSection>
        ) : (
          <LoginDialog>
            <Button className="w-full mt-6 hover:cursor-pointer" size="lg">
              Solicitar cotización
            </Button>
          </LoginDialog>
        )}
      </div>
    </motion.aside>
  );
}
