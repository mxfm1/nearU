'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileLogoProps {
  src?: string;
  alt: string;
  companyName: string;
}

export function ProfileLogo({ src, alt, companyName }: ProfileLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative z-10"
    >
      <div
        className={cn(
          'h-24 w-24 sm:h-28 sm:w-28 md:h-24 md:w-48',
          'rounded-md border-4 border-background overflow-hidden',
          'bg-muted flex items-center justify-center',
          'shadow-md'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={128}
            height={128}
            className="object-cover h-full w-full"
          />
        ) : (
          <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
        )}
      </div>
    </motion.div>
  );
}
