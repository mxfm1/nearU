'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Clapperboard,
  Monitor,
  Utensils,
  Camera,
  Lightbulb,
  Speaker,
  Paintbrush,
  Building2,
  Tent,
  Briefcase,
} from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'

const categories = [
  { name: 'Producción', slug: 'produccion', icon: Clapperboard, type: 'Proveedores' as const },
  { name: 'Streaming', slug: 'streaming', icon: Monitor, type: 'Proveedores' as const },
  { name: 'Catering', slug: 'catering', icon: Utensils, type: 'Proveedores' as const },
  { name: 'Fotografía', slug: 'fotografia', icon: Camera, type: 'Proveedores' as const },
  { name: 'Iluminación', slug: 'iluminacion', icon: Lightbulb, type: 'Proveedores' as const },
  { name: 'Sonido', slug: 'sonido', icon: Speaker, type: 'Proveedores' as const },
  { name: 'Decoración', slug: 'decoracion', icon: Paintbrush, type: 'Proveedores' as const },
  { name: 'Congresos', slug: 'congresos', icon: Building2, type: 'Organizadores' as const },
  { name: 'Ferias', slug: 'ferias', icon: Tent, type: 'Organizadores' as const },
  { name: 'Eventos Corporativos', slug: 'eventos-corporativos', icon: Briefcase, type: 'Organizadores' as const },
]

const popularCategories = categories.slice(0, 5)

export default function Home() {
  const router = useRouter()

  function handleSearch(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  function handleCategoryClick(name: string) {
    handleSearch(name)
  }

  return (
    <div className="bg-background">
      <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-[52px] font-semibold leading-[1.15] text-foreground mb-6 max-w-3xl mx-auto">
            Encuentra proveedores para tu evento
          </h1>
          <p className="text-[20px] leading-[1.7] text-muted-foreground max-w-2xl mx-auto mb-10">
            Conectamos empresas con los mejores servicios para eventos corporativos, ferias y congresos
          </p>

          <SearchBar onSearch={handleSearch} />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Categorías populares:</span>
            {popularCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.name)}
                className="px-3 py-1.5 text-sm rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[28px] font-semibold leading-tight text-foreground mb-10">
            Explora por categoría
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.slug}
                  href={`/search?category=${cat.slug}`}
                  className="bg-card rounded-lg shadow-sm p-6 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-md bg-muted">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                  <Badge
                    variant={cat.type === 'Proveedores' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {cat.type}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto bg-card rounded-lg shadow-sm p-10 md:p-16 text-center">
          <h2 className="text-[28px] font-semibold leading-tight text-foreground mb-4">
            ¿Tienes una empresa y ofreces servicios?
          </h2>
          <p className="text-[20px] leading-[1.7] text-muted-foreground max-w-xl mx-auto mb-8">
            Regístrate y Publica tus servicios para llegar a más organizadores
          </p>
          <Link
            href="/register"
            className="inline-block border border-primary text-primary rounded-md px-7 py-3.5 text-base font-semibold tracking-wide hover:bg-muted transition-colors"
          >
            Publicar servicios
          </Link>
        </div>
      </section>
    </div>
  )
}
