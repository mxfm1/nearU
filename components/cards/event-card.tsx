'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  thumbnail: string;
  slug: string;
  className?: string;
}

export function EventCard({
  title,
  description,
  date,
  location,
  thumbnail,
  slug,
  className,
}: EventCardProps) {
  return (
    <Link
      href={`/eventos/${slug}`}
      className={cn(
        'group block w-[300px] bg-card rounded-md overflow-hidden',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted max-h-56">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={className ? '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw' : '300px'}
        />
      </div>

      <div className="p-4 space-y-2">
        <h4 className="text-[22px] font-semibold text-foreground leading-tight">{title}</h4>

        <p className="text-[15px] text-muted-foreground leading-snug line-clamp-2">{description}</p>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-4 w-4 flex-shrink-0" />
          <span className="text-[15px] leading-snug">{date}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-[15px] leading-snug">{location}</span>
        </div>
      </div>
    </Link>
  );
}
