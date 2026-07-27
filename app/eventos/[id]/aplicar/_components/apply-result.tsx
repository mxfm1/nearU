'use client';

import Link from 'next/link';
import { CheckCircle, XCircle, TrendingUp, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplyStepper } from './apply-stepper';
import type { ApplicationStatus } from '@/lib/applications-api';

interface StatsData {
  activeVacancies?: number;
  profileMatch?: number;
}

interface ApplyResultProps {
  status: ApplicationStatus;
  eventTitle: string;
  eventId: string;
  stats?: StatsData;
}

export function ApplyResult({ status, eventTitle, eventId, stats }: ApplyResultProps) {
  const isAccepted = status === 'accepted';

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Multi-Step Indicator */}
        {/* <section className="max-w-2xl mx-auto mb-12">
          <ApplyStepper currentStep={3} applicationStatus={status} />
        </section> */}

        {/* Main Content */}
        <section className="max-w-4xl mx-auto">
          {/* Glass Card */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch border border-border">
            {/* Illustration Area */}
            <div className="w-full md:w-1/2 bg-muted flex items-center justify-center p-8 md:p-12 relative overflow-hidden min-h-[300px] md:min-h-[400px]">
              {/* Background aesthetic circles */}
              <div
                className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl ${
                  isAccepted ? 'bg-green-100' : 'bg-red-100'
                }`}
              />
              <div
                className={`absolute -bottom-12 -right-12 w-64 h-64 rounded-full blur-3xl ${
                  isAccepted ? 'bg-green-50' : 'bg-red-50'
                }`}
              />

              {isAccepted ? (
                <img
                  alt="Postulación aceptada"
                  className="relative z-10 w-full max-w-[280px] h-auto drop-shadow-xl transition-transform hover:scale-105 duration-700"
                  src="/success.png"
                />
              ) : (
                <img
                  alt="Postulación no seleccionada"
                  className="relative z-10 w-full max-w-[280px] h-auto drop-shadow-xl transition-transform hover:scale-105 duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIJH1NCK4SqUh1V67Z6X8MApQx7Q8UQk5XZ1GQySFEWa2Wh2ecynghABFuSLHnOYIWzLOxyJGVR8lausCIEBJtVZoQblj0gK1q60_gQOlcfsZmiXfsB7ozfZpY6HhYi8vjrHmIrTUnqjFbgymBRQpUAeLTKAxikbN26eRMy_grxEKDnnSzSMshmibmbQ7dKKWhhFLDoXHXo0r0_nxx-AgQsw3P13u-uOCUmgqtZotIsThj44iwOjV8"
                />
              )}
            </div>

            {/* Text Content Area */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-left">
              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit mb-6 ${
                  isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isAccepted ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-xs font-medium">Estado Finalizado</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                {isAccepted
                  ? '¡Felicitaciones! Has sido seleccionado'
                  : 'Postulación no seleccionada'}
              </h1>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {isAccepted ? (
                  <>
                    ¡Felicidades! Tu perfil ha sido seleccionado para participar en{' '}
                    <strong>{eventTitle}</strong>.
                    <span className="block mt-2">
                      Nos pondremos en contacto contigo pronto con los siguientes pasos.
                    </span>
                  </>
                ) : (
                  <>
                    Gracias por tu interés en esta vacante. En esta ocasión la empresa ha decidido
                    avanzar con otros perfiles que se alinean más estrechamente con sus necesidades
                    actuales.
                    <span className="block mt-3 font-semibold text-primary">
                      ¡No te rindas, hay muchas más oportunidades esperándote en NearU!
                    </span>
                  </>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/">Volver al Inicio</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/eventos">Ver otras vacantes</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section - only show when rejected */}
          {/* {!isAccepted && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
              <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Mercado activo</p>
                  <p className="text-lg font-bold text-primary">
                    {stats?.activeVacancies ? `+${stats.activeVacancies} Vacantes` : 'Cargando...'}
                  </p>
                </div>
              </div>
              <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Tu Perfil</p>
                  <p className="text-lg font-bold text-primary">
                    {stats?.profileMatch ? `${stats.profileMatch}% Match` : 'Cargando...'}
                  </p>
                </div>
              </div>
              <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Próximos Pasos</p>
                  <p className="text-lg font-bold text-primary">Seguí aplicando</p>
                </div>
              </div>
            </div>
          )} */}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 px-4 md:px-8 py-10 max-w-6xl mx-auto">
          <div className="col-span-2">
            <span className="font-bold text-xl block mb-4">NearU</span>
            <p className="text-sm opacity-80 max-w-xs">
              Conectando el talento con los eventos más prestigiosos del sector corporativo.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest block mb-4">Explorar</span>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Eventos
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Sedes
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest block mb-4">Recursos</span>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Guía de Uso
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest block mb-4">Empresa</span>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Carreras
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest block mb-4">Legal</span>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link className="text-sm opacity-70 hover:opacity-100 transition-opacity" href="#">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-4 md:px-8 py-6 border-t border-white/10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs opacity-60">© 2024 NearU. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              🌐
            </Link>
            <Link href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
              ✉️
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
