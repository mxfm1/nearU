'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaArrowLeft,
  FaMapPin,
  FaCalendar,
  FaUsers,
  FaPhone,
  FaGlobe,
} from 'react-icons/fa';
import { Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks';

const MOCK_PROFILE = {
  name: 'Terra Roots Co.',
  subtitle: 'Arquitectura Bioclimática & Paisajismo',
  verified: true,
  location: 'Medellín, Colombia',
  founded: 'Desde 2012',
  employees: '11-50 Empleados',
  description:
    'En Terra Roots Co., nos dedicamos a transformar espacios urbanos en ecosistemas vibrantes. Creemos que la arquitectura y la naturaleza no deben competir, sino coexistir en armonía. Con más de 10 años de experiencia, lideramos proyectos de diseño regenerativo en toda Latinoamérica, priorizando materiales locales y eficiencia energética.',
  tags: ['Sostenibilidad', 'EcoDiseño', 'UrbaniismoVerde', 'HuertosUrbanos', 'Arquitectura'],
  contact: {
    email: 'hola@terraroots.co',
    phone: '+57 300 123 4567',
    website: 'www.terraroots.co',
  },
  social: {
    instagram: '#',
    linkedin: '#',
    whatsapp: '#',
  },
  address: 'Barrio El Poblado, Edificio Milka De Oro.',
  services: [
    {
      id: 1,
      title: 'Diseño de Jardines Verticales',
      price: 'Desde $1,200',
      published: 'Publicado hace 2 días',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Consultoría de Huertos Urbanos',
      price: 'Desde $450',
      published: 'Publicado hace 1 semana',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    },
  ],
};

export default function ProfilePreviewPage() {
  const { loading, user } = useAuth();

  const profile = MOCK_PROFILE;

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(user);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center">
          <Link
            href="/user/perfil"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="flex-1 text-center font-semibold text-foreground pr-8">NearU</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="h-48 md:h-64 bg-gradient-to-r from-green-800 to-green-600">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-full bg-brand/20 border-4 border-white flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-brand">TR</span>
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-white/80 text-sm">{profile.subtitle}</p>
              </div>
              <Button className="bg-brand hover:bg-brand/90 text-white shrink-0">
                Contactar ahora
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {profile.verified && (
            <Badge className="bg-brand text-white">
              <span className="mr-1">✓</span> Empresa Verificada
            </Badge>
          )}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <FaMapPin className="h-4 w-4" />
            {profile.location}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <FaCalendar className="h-4 w-4" />
            {profile.founded}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <FaUsers className="h-4 w-4" />
            {profile.employees}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Información General</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{profile.description}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Servicios y Publicaciones</h3>
                {/* <Link href="/search?type=services" className="text-sm text-brand hover:underline">
                  Ver todo
                </Link> */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.services.map((service) => (
                  <Card
                    key={service.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="relative h-40">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      {service.isNew && (
                        <Badge className="absolute top-2 left-2 bg-brand text-white text-[10px]">
                          NUEVO
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">{service.title}</h4>
                      <p className="text-brand font-medium text-sm mb-1">{service.price}</p>
                      <p className="text-xs text-muted-foreground">{service.published}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {profile.contact.email}
                  </a>
                  <a
                    href={`tel:${profile.contact.phone}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    <FaPhone className="h-4 w-4" />
                    {profile.contact.phone}
                  </a>
                  <a
                    href={`https://${profile.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    <FaGlobe className="h-4 w-4" />
                    {profile.contact.website}
                  </a>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Redes Sociales</h4>
                  <div className="flex gap-3">
                    <a
                      href={profile.social.instagram}
                      className="text-muted-foreground hover:text-brand transition-colors"
                    >
                      <FaInstagram className="h-5 w-5" />
                    </a>
                    <a
                      href={profile.social.linkedin}
                      className="text-muted-foreground hover:text-brand transition-colors"
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={profile.social.whatsapp}
                      className="text-muted-foreground hover:text-brand transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Ubicación</h4>
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                    <div className="text-center">
                      <FaMapPin className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">{profile.address}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-brand hover:bg-brand/90 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t border-border mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          © 2024 NearU Mercado B2B. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
