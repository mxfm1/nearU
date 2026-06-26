'use client'

import { Children, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HorizontalScrollProps {
  title: string
  seeAllHref: string
  children: React.ReactNode
  maxItems?: number
}

export function HorizontalScroll({
  title,
  seeAllHref,
  children,
  maxItems = 8,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children).slice(0, maxItems)

  return (
    <section>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="text-[28px] font-semibold leading-tight text-foreground">
          {title}
        </h3>
        <Link
          href={seeAllHref}
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border) transparent',
          }}
        >
          {items.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex-shrink-0"
            >
              {child}
            </motion.div>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
