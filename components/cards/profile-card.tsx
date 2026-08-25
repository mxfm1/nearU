'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  name: string;
  description?: string | null;
  category: string;
  verified: boolean;
  location?: string | null;
  employees?: number | null;
  thumbnail?: string | null;
  className?: string;
}

export function ProfileCard({
  name,
  description,
  category,
  verified,
  location,
  employees,
  thumbnail,
  className,
}: ProfileCardProps) {
  const profileHref = `/explorar?scope=organizations&q=${encodeURIComponent(name)}`;

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-md bg-card shadow-sm transition-shadow duration-300 hover:shadow-md',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={thumbnail ?? 'https://placehold.co/600x340?text=Empresa'}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[22px] font-semibold leading-tight text-foreground">{name}</h4>
          {verified && (
            <Badge className="shrink-0 gap-1 border-0 bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verificada
            </Badge>
          )}
        </div>

        <p className="text-[15px] leading-snug text-muted-foreground">{category}</p>
        {description && (
          <p className="line-clamp-2 text-[15px] leading-snug text-muted-foreground">
            {description}
          </p>
        )}

        <div className="relative mt-auto space-y-2 text-muted-foreground">
          <div className="space-y-2">
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-[15px] leading-snug">{location}</span>
              </div>
            )}
            {employees !== null && employees !== undefined && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0" />
                <span className="text-[15px] leading-snug">{employees} empleados</span>
              </div>
            )}
          </div>

          <motion.div
            className="flex justify-end sm:absolute sm:bottom-0 sm:right-0"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={profileHref}
              className="inline-flex shrink-0 translate-y-0 items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:translate-y-1 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            >
              Ver perfil
            </Link>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
