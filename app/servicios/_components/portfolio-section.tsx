'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PortfolioImage } from '@/lib/servicios-api'

interface PortfolioSectionProps {
  portfolio: PortfolioImage[]
}

function usePortfolioImages(images: PortfolioImage[]) {
  return useQuery({
    queryKey: ['portfolio-images'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200))
      return images
    },
    enabled: true,
  })
}

export function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: images, isLoading } = usePortfolioImages(portfolio)

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="px-4 sm:px-6 mt-8 space-y-4 pb-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          Trabajos Realizados
        </h2>

        {portfolio.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'flex-shrink-0 w-[85vw] sm:w-[420px]',
                'aspect-video rounded-lg bg-muted animate-pulse',
              )}
            />
          ))}
        </div>
      ) : !images || images.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageOff className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground text-base max-w-sm">
            Este servicio no tiene imágenes subidas de casos de uso.
          </p>
        </motion.div>
      ) : (
        <div
          ref={scrollRef}
          className={cn(
            'flex gap-6 overflow-x-auto snap-x snap-mandatory',
            'scrollbar-hide pb-2',
          )}
          style={{ scrollbarWidth: 'none' }}
        >
          {images?.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                'flex-shrink-0 w-[85vw] sm:w-[420px]',
                'aspect-video rounded-lg overflow-hidden',
                'snap-center bg-muted relative group cursor-pointer',
              )}
            >
              <Image
                src={image.url}
                alt={image.title ?? `Imagen ${index + 1}`}
                width={420}
                height={240}
                className={cn(
                  'object-cover h-full w-full',
                  'transition-transform duration-500 group-hover:scale-105',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
                  {image.title}
                </h3>
                <p className="text-white/80 text-sm mt-1 line-clamp-2 transition-all duration-300 group-hover:line-clamp-3">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
