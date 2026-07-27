'use client';

export default function Loading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
      </div>
    </div>
  );
}
