'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface MensajesEmptyProps {
  onStartConversation?: () => void;
}

export function MensajesEmpty({ onStartConversation }: MensajesEmptyProps) {
  return (
    <motion.div
      {...fadeInUp}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Sin mensajes aún</h2>
        <p className="text-sm text-muted-foreground mb-6">
          No hay mensajes en esta conversación. ¡Inicia la conversación!
        </p>
        {onStartConversation && (
          <button
            onClick={onStartConversation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Enviar mensaje
          </button>
        )}
      </div>
    </motion.div>
  );
}
