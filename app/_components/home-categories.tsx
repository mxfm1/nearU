'use client';

import { useRouter } from 'next/navigation';
import { Clapperboard, Music, UtensilsCrossed, Camera, Lightbulb, LayoutGrid } from 'lucide-react';

const categories = [
  { name: 'Producción', slug: 'produccion', icon: Clapperboard },
  { name: 'Sonido', slug: 'sonido', icon: Music },
  { name: 'Catering', slug: 'catering', icon: UtensilsCrossed },
  { name: 'Fotografía', slug: 'fotografia', icon: Camera },
  { name: 'Iluminación', slug: 'iluminacion', icon: Lightbulb },
  { name: 'Ver todas', slug: 'all', icon: LayoutGrid },
];

export function HomeCategories() {
  const router = useRouter();

  function handleCategoryClick(slug: string) {
    if (slug === 'all') {
      router.push('/search');
    } else {
      router.push(`/search?category=${slug}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-card border border-border rounded-full text-xs sm:text-sm font-medium text-text-primary transition-all duration-200 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
