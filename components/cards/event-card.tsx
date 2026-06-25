'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventCardProps {
  title: string
  description: string
  date: string
  location: string
  thumbnail: string
  slug: string
}

export function EventCard({
  title,
  description,
  date,
  location,
  thumbnail,
  slug,
}: EventCardProps) {
  return (
    <Link
      href={`/eventos/${slug}`}
      className={cn(
        'group block w-[300px] bg-card rounded-lg overflow-hidden',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="300px"
        />
      </div>

      <div className="p-4 space-y-2">
        <h4 className="text-[22px] font-semibold text-foreground leading-tight">
          {title}
        </h4>

        <p className="text-[15px] text-muted-foreground leading-snug line-clamp-2">
          {description}
        </p>

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
  )
}
