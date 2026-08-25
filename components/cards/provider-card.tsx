'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProviderCardProps {
  name: string;
  category: string;
  verified: boolean;
  location: string;
  thumbnail: string;
  slug: string;
  className?: string;
}

export function ProviderCard({
  name,
  category,
  verified,
  location,
  thumbnail,
  slug,
  className,
}: ProviderCardProps) {
  return (
    <Link
      href={`/servicios/${slug}`}
      className={cn(
        'group block w-[300px] bg-card rounded-md overflow-hidden',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 aspect-[16/9]"
          sizes={className ? '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw' : '300px'}
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="text-[22px] font-semibold text-foreground leading-tight truncate">
            {name}
          </h4>
          {verified && (
            <Badge className="flex-shrink-0 bg-accent text-accent-foreground border-0 gap-1 text-xs font-medium px-2 py-0.5">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verificado
            </Badge>
          )}
        </div>

        <p className="text-[15px] text-muted-foreground leading-snug">{category}</p>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-[15px] leading-snug">{location}</span>
        </div>
      </div>
    </Link>
  );
}
