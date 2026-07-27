'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Inbox, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const open = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={open} onMouseLeave={close}>
      <Button variant="ghost" size="icon" aria-label="Notificaciones">
        <Inbox className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="absolute top-full right-0 mt-2 w-80 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium">Notificaciones</p>
            </div>

            <div className="px-4 py-8 flex flex-col items-center gap-3">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                No tienes notificaciones pendientes
              </p>
            </div>

            <div className="border-t border-border">
              <Link
                href="/user/notificaciones"
                className="flex items-center justify-center px-4 py-2.5 text-sm text-primary hover:bg-muted transition-colors"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
