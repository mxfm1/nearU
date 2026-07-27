'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BannerSectionProps {
  src?: string;
  alt: string;
}

export function BannerSection({ src, alt }: BannerSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] overflow-hidden bg-muted"
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 1200px"
          priority
        />
      ) : (
        <div
          className={cn(
            'h-full w-full',
            'bg-gradient-to-br from-primary/20 via-primary/10 to-muted'
          )}
        />
      )}
    </motion.div>
  );
}
