'use client'

import { useState } from 'react'
import { X, FileText, Image, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Attachment } from '@/lib/mensajes-api'

interface AttachmentPreviewProps {
  attachments: Attachment[]
  previews: string[]
  files: File[]
  onRemove: (index: number) => void
  uploading?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ImageDialog({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        src={src}
        alt="Imagen"
        className="max-w-full max-h-full object-contain rounded-lg"
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </motion.div>
  )
}

function LocalFilePreview({
  file,
  index,
  onRemove,
  uploading,
  previewUrl,
}: {
  file: File
  index: number
  onRemove: (index: number) => void
  uploading: boolean
  previewUrl: string | null
}) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const isImage = file.type.startsWith('image/')

  const handleClick = () => {
    if (uploading) return
    if (isImage) {
      setShowImageDialog(true)
    } else {
      window.open(previewUrl || URL.createObjectURL(file), '_blank')
    }
  }

  return (
    <>
      <AnimatePresence>
        {showImageDialog && previewUrl && (
          <ImageDialog src={previewUrl} onClose={() => setShowImageDialog(false)} />
        )}
      </AnimatePresence>

      <motion.div
        key={`file-${index}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative group"
      >
        <div
          onClick={handleClick}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border bg-card cursor-pointer transition-all hover:scale-[1.02]
            ${isImage
              ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
              : 'border-border bg-muted/50 hover:bg-muted'
            }
            ${uploading ? 'cursor-not-allowed opacity-70' : ''}
          `}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            getFileIcon(file)
          )}
          <div className="flex flex-col">
            <span className="text-xs font-medium max-w-[100px] truncate">
              {file.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        {!uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index)
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    </>
  )
}

function UploadedAttachmentPreview({
  attachment,
  index,
  onRemove,
}: {
  attachment: Attachment
  index: number
  onRemove: (index: number) => void
}) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const isImage = attachment.type === 'IMAGE'

  const handleClick = () => {
    if (isImage) {
      setShowImageDialog(true)
    } else {
      window.open(attachment.url, '_blank')
    }
  }

  return (
    <>
      <AnimatePresence>
        {showImageDialog && (
          <ImageDialog src={attachment.url} onClose={() => setShowImageDialog(false)} />
        )}
      </AnimatePresence>

      <motion.div
        key={`attachment-${index}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative group"
      >
        <div
          onClick={handleClick}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border bg-card cursor-pointer transition-all hover:scale-[1.02]
            ${isImage
              ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
              : 'border-border bg-muted/50 hover:bg-muted'
            }
          `}
        >
          {isImage ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <FileText className="w-5 h-5 text-muted-foreground" />
          )}
          <div className="flex flex-col">
            <span className="text-xs font-medium max-w-[100px] truncate">
              {attachment.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatFileSize(attachment.size)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </>
  )
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) {
    return <Image className="w-5 h-5 text-primary" />
  }
  return <FileText className="w-5 h-5 text-muted-foreground" />
}

export function AttachmentPreview({
  attachments,
  previews,
  files,
  onRemove,
  uploading = false,
}: AttachmentPreviewProps) {
  if (files.length === 0 && attachments.length === 0) {
    return null
  }

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => (
            <LocalFilePreview
              key={`file-${index}`}
              file={file}
              index={index}
              onRemove={onRemove}
              uploading={uploading}
              previewUrl={previews[index] || null}
            />
          ))}

          {attachments.map((attachment, index) => (
            <UploadedAttachmentPreview
              key={`attachment-${index}`}
              attachment={attachment}
              index={index}
              onRemove={(idx) => onRemove(idx + files.length)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
