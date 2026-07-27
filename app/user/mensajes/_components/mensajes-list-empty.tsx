'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { fadeInUp } from './constants';

interface MensajesListEmptyProps {
  message?: string;
}

export function MensajesListEmpty({ message }: MensajesListEmptyProps) {
  return (
    <motion.div {...fadeInUp} className="flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-3">No tenés mensajes todavía</h2>
        <p className="text-sm text-muted-foreground mb-8">
          {message ||
            'Cuando una empresa te seleccione para trabajar en uno de sus eventos, podrás chatear con ellos aquí.'}
        </p>
        <Link
          href="/descubrir"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Explorar eventos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
