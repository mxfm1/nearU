'use client'

import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadZoneProps {
  className?: string
  aspectRatio?: string
  minResolution?: string
}

export function ImageUploadZone({
  className,
  aspectRatio = '16:9',
  minResolution = '1920x1080',
}: ImageUploadZoneProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg bg-muted/30 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-muted/50',
        className
      )}
    >
      <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          UPLOAD HIGH-RES COVER
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Optimal ratio: {aspectRatio}, Min {minResolution}
        </p>
      </div>
    </div>
  )
}
