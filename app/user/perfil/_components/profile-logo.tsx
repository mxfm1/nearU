'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { uploadFiles } from '@/lib/uploadthing'

interface ProfileLogoProps {
  logoUrl: string | null
  companyName: string
  onChange: (url: string | null) => void
}

export function ProfileLogo({ logoUrl, companyName, onChange }: ProfileLogoProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleUpload(file: File) {
    setUploading(true)
    setFeedback('idle')
    try {
      const [result] = await uploadFiles('profileLogo', { files: [file] })
      onChange(result.url)
      setFeedback('success')
      setTimeout(() => setFeedback('idle'), 3000)
    } catch (err) {
      console.error('Logo upload failed:', err)
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
            Logo de la Empresa
          </Label>
          {feedback === 'success' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Logo actualizado
            </span>
          )}
          {feedback === 'error' && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              Error al subir
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`relative w-20 h-20 rounded-full bg-brand/20 border-2 border-border flex items-center justify-center group cursor-pointer shrink-0 ${
              uploading ? 'pointer-events-none' : ''
            }`}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-brand">
                {companyName?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
            )}
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
              className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                showOverlay ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0 group-hover:bg-black/40 group-hover:opacity-100'
              }`}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{companyName}</p>
            <p className="text-sm text-muted-foreground">Logo y marca</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
