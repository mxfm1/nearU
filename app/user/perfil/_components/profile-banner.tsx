'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { uploadFiles } from '@/lib/uploadthing'

interface ProfileBannerProps {
  bannerUrl: string | null
  onChange: (url: string | null) => void
}

export function ProfileBanner({ bannerUrl, onChange }: ProfileBannerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleUpload(file: File) {
    setUploading(true)
    setFeedback('idle')
    try {
      const [result] = await uploadFiles('profileBanner', { files: [file] })
      onChange(result.url)
      setFeedback('success')
      setTimeout(() => setFeedback('idle'), 3000)
    } catch (err) {
      console.error('Banner upload failed:', err)
      setFeedback('error')
    } finally {
      setUploading(false)
    }
  }

  const showOverlay = uploading || feedback !== 'idle'

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-foreground">
            Banner de la Empresa
          </Label>
          {feedback === 'success' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Banner actualizado
            </span>
          )}
          {feedback === 'error' && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              Error al subir
            </span>
          )}
        </div>
        <div className="relative h-48 bg-muted rounded-lg overflow-hidden group cursor-pointer">
          <img
            src={bannerUrl ?? 'https://placehold.co/1200x300?text=Sin+banner'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              showOverlay ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0 group-hover:bg-black/40 group-hover:opacity-100'
            }`}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            <div className="text-center text-white">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Subiendo banner...</p>
                </>
              ) : (
                <>
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Cambiar banner</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
