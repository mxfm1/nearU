'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, AlertCircle, CheckCircle2, Camera, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadFiles } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

export type UploadRoute = 'eventThumbnail' | 'eventBanner';

interface SingleImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  route: UploadRoute;
}

export function SingleImageUpload({ label, value, onChange, route }: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleUpload(file: File) {
    setUploading(true);
    setFeedback('idle');
    try {
      const [result] = await uploadFiles(route, { files: [file] });
      onChange(result.url);
      setFeedback('success');
      setTimeout(() => setFeedback('idle'), 3000);
    } catch {
      setFeedback('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <div
        className={cn(
          'relative rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200',
          'group cursor-pointer',
          value ? 'border-border' : 'border-muted-foreground/20 hover:border-primary/50'
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {value ? (
          <div className="relative overflow-hidden aspect-[3/1]">
            <Image src={value} alt={label} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-6">
            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground text-center">
              {uploading ? 'Subiendo...' : 'Subir portada'}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}

        {feedback === 'success' && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}
        {feedback === 'error' && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        )}

        <Input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
      </div>
      {value && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            Imagen subida
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-destructive hover:text-destructive"
            onClick={() => onChange('')}
          >
            Eliminar
          </Button>
        </div>
      )}
    </div>
  );
}
