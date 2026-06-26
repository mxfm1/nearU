'use client'

import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  Globe,
  Camera,
  ExternalLink,
  X,
  MessageCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { MockContactInfo } from '@/lib/service-mock-data'
import ApplyFormSection from './apply-form-section'

interface ContactSectionProps {
  contactInformation: MockContactInfo[]
}

const contactIcons: Record<MockContactInfo['type'], typeof Mail> = {
  email: Mail,
  telefono: Phone,
  whatsapp: MessageCircle,
  website: Globe,
  instagram: Camera,
  facebook: ExternalLink,
  twitter: X,
}

const labels: Record<MockContactInfo['type'], string> = {
  email: 'Correo',
  telefono: 'Teléfono',
  whatsapp: 'WhatsApp',
  website: 'Sitio web',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
}

export function ContactSection({
  contactInformation,
}: ContactSectionProps) {
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
          {contactInformation.map((contact, index) => {
            const Icon = contactIcons[contact.type]

            return (
              <div
                key={index}
                className="
              flex items-start gap-3
            "
              >
                <Icon className="h-4 w-4 mt-1 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {contact.type}
                  </p>

                  <p className="text-sm font-medium break-all">
                    {contact.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <ApplyFormSection>
          <Button className="w-full mt-6 hover:cursor-pointer" size="lg">
            Solicitar cotización
          </Button>
        </ApplyFormSection>
      </div>
    </motion.aside>
  )
}