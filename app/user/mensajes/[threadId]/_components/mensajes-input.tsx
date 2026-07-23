'use client'

import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Send, Paperclip, Image } from 'lucide-react'
import { uploadFiles } from '@/lib/uploadthing'
import { mensajesApi, type Attachment, type MessageType } from '@/lib/mensajes-api'
import { AttachmentPreview } from './mensajes-attachment-preview'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface MensajesInputProps {
  threadId: string
}

interface PendingFile {
  file: File
  preview: string
}

export function MensajesInput({ threadId }: MensajesInputProps) {
  const [message, setMessage] = useState('')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<Attachment[]>([])
  const queryClient = useQueryClient()
  const textInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const sendMutation = useMutation({
    mutationFn: async () => {
      let attachments = [...uploadedAttachments]

      if (pendingFiles.length > 0) {
        const filesToUpload = pendingFiles.map((pf) => pf.file)
        
        const imageFiles = filesToUpload.filter((f) => f.type.startsWith('image/'))
        const docFiles = filesToUpload.filter((f) => !f.type.startsWith('image/'))

        if (imageFiles.length > 0) {
          const imageResults = await uploadFiles('messageImage', { files: imageFiles })
          const newAttachments = imageResults.map((r) => ({
            url: r.url,
            type: 'IMAGE' as const,
            mimeType: r.type || 'image/jpeg',
            size: r.size || 0,
            name: r.name || 'image',
          }))
          attachments = [...attachments, ...newAttachments]
        }

        if (docFiles.length > 0) {
          const docResults = await uploadFiles('messageFile', { files: docFiles })
          const newAttachments = docResults.map((r) => ({
            url: r.url,
            type: 'FILE' as const,
            mimeType: r.type || 'application/octet-stream',
            size: r.size || 0,
            name: r.name || 'file',
          }))
          attachments = [...attachments, ...newAttachments]
        }
      }

      let messageType: MessageType = 'TEXT'
      if (attachments.length > 0 && message.trim()) {
        messageType = 'MIXED'
      } else if (attachments.length > 0) {
        const firstAttachment = attachments[0]
        messageType = firstAttachment.type === 'IMAGE' ? 'IMAGE' : 'FILE'
      }

      const payload = {
        content: message.trim() || null,
        messageType,
        attachments: attachments.length > 0 ? attachments : undefined,
      }

      return mensajesApi.sendMessage(threadId, payload)
    },
    onSuccess: () => {
      setMessage('')
      setPendingFiles([])
      setUploadedAttachments([])
      queryClient.invalidateQueries({ queryKey: ['thread-messages', threadId] })
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPendingFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPendingFiles((prev) => [...prev, ...newPendingFiles])
    e.target.value = ''
  }

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleRemoveUploadedAttachment = (index: number) => {
    setUploadedAttachments((prev) => {
      const newAttachments = [...prev]
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sendMutation.isPending) return
    if (!message.trim() && pendingFiles.length === 0 && uploadedAttachments.length === 0) return
    sendMutation.mutate()
  }

  const isEmpty = !message.trim() && pendingFiles.length === 0 && uploadedAttachments.length === 0

  return (
    <motion.div
      {...fadeInUp}
      className="p-3 md:p-4 bg-card border-t border-border"
    >
      <AttachmentPreview
        attachments={uploadedAttachments}
        previews={pendingFiles.map((pf) => pf.preview)}
        files={pendingFiles.map((pf) => pf.file)}
        onRemove={(index) => {
          if (index < pendingFiles.length) {
            handleRemovePendingFile(index)
          } else {
            handleRemoveUploadedAttachment(index - pendingFiles.length)
          }
        }}
        uploading={sendMutation.isPending}
      />

      <form onSubmit={handleSubmit} className="flex items-end gap-2 md:gap-3">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            title="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            title="Adjuntar imagen"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex-1 relative">
          <input
            ref={textInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              pendingFiles.length > 0 || uploadedAttachments.length > 0
                ? 'Agregar un mensaje...'
                : 'Escribe un mensaje...'
            }
            className="w-full bg-muted border-none rounded-full px-4 py-2.5 md:py-3 text-sm md:text-base focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            disabled={sendMutation.isPending}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isEmpty || sendMutation.isPending}
          className="bg-primary text-primary-foreground w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sendMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
