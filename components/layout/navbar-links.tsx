'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

const publicLinks = [
  { label: 'Explorar', href: '/explorar' },
  // { label: 'Quiénes somos', href: '/quienes-somos' },
];

const privateLinks = [{ label: 'Descubrir', href: '/descubrir' }];

export function NavbarLinks() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = user ? privateLinks : publicLinks;

  return (
    <div className="flex items-center gap-6">
      {links.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== '/' && pathname?.startsWith(`${link.href}/`));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-1.5 text-sm font-medium transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{link.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
