'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ServiceDetailProps {
  title: string
  description: string
  categoryName: string
  companyName: string
  location: string
}

export function ServiceDetail({
  title,
  description,
  categoryName,
  companyName,
  location,
}: ServiceDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 bg-white shadow-lg rounded-md p-6"
    >
      {/* <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs font-medium">
          {categoryName}
        </Badge>
      </div> */}

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground ml-2">{companyName}</p>
      </div>

      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
        {description}
      </p>

      <div className='border border-t border-background' />

      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm sm:text-base">{location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {categoryName}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}
