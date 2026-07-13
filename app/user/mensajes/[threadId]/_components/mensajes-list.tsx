'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, CheckCheck, X, Image as ImageIcon } from 'lucide-react'
import type { Mensaje } from '@/lib/mensajes-api'

const container = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface MensajesListProps {
  mensajes: Mensaje[]
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isToday(isoString: string): boolean {
  const date = new Date(isoString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function SystemMessage({ content, timestamp }: { content: string; timestamp: string }) {
  return (
    <motion.div variants={item} className="flex justify-center my-4">
      <div className="flex flex-col items-center gap-1 px-4 py-2 bg-muted/50 rounded-full">
        <p className="text-xs text-muted-foreground text-center">{content}</p>
        <span className="text-[10px] text-muted-foreground/70">{formatTime(timestamp)}</span>
      </div>
    </motion.div>
  )
}

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
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
          alt="Imagen ampliada"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export function MensajesList({ mensajes }: MensajesListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const sortedMensajes = [...mensajes].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  return (
    <div className="p-4 md:p-6 bg-muted/20">
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}

      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-4"
      >
        {sortedMensajes.map((mensaje, index) => {
          if (mensaje.messageType === 'SYSTEM') {
            return (
              <SystemMessage
                key={mensaje.id}
                content={mensaje.content || 'Mensaje del sistema'}
                timestamp={mensaje.timestamp}
              />
            )
          }

          const showDateDivider =
            index === 0 ||
            sortedMensajes[index - 1].messageType === 'SYSTEM' ||
            !isToday(mensaje.timestamp) ||
            isToday(sortedMensajes[index - 1].timestamp) !==
              isToday(mensaje.timestamp)

          return (
            <motion.div key={mensaje.id} variants={item}>
              {showDateDivider && isToday(mensaje.timestamp) && (
                <div className="flex items-center gap-4 my-4">
                  <div className="h-px flex-grow bg-border" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Hoy
                  </span>
                  <div className="h-px flex-grow bg-border" />
                </div>
              )}

              <div
                className={`flex gap-3 max-w-[85%] md:max-w-[80%] ${
                  mensaje.isFromCurrentUser
                    ? 'self-end flex-row-reverse'
                    : ''
                }`}
              >
                {!mensaje.isFromCurrentUser && (
                  <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                    {mensaje.senderAvatar ? (
                      <img
                        src={mensaje.senderAvatar}
                        alt={mensaje.senderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {mensaje.senderName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`flex flex-col gap-1 ${
                    mensaje.isFromCurrentUser ? 'items-end' : ''
                  }`}
                >
                  <div
                    className={`p-3 md:p-4 rounded-2xl shadow-sm ${
                      mensaje.isFromCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card text-card-foreground rounded-bl-none'
                    }`}
                  >
                    {mensaje.content && (
                      <p className="text-sm md:text-base whitespace-pre-wrap">
                        {mensaje.content}
                      </p>
                    )}

                    {mensaje.attachments && mensaje.attachments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {mensaje.attachments.map((attachment, idx) => {
                          if (attachment.type === 'IMAGE') {
                            return (
                              <div
                                key={idx}
                                className="relative cursor-pointer group"
                                onClick={() => setSelectedImage(attachment.url)}
                              >
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className={`rounded-lg max-w-[200px] md:max-w-[300px] ${
                                    mensaje.isFromCurrentUser
                                      ? 'group-hover:opacity-90'
                                      : 'group-hover:opacity-90'
                                  }`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                  <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            )
                          }

                          return (
                            <a
                              key={idx}
                              href={attachment.url}
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                                mensaje.isFromCurrentUser
                                  ? 'bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15'
                                  : 'bg-muted/50 border-border hover:bg-muted'
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                  mensaje.isFromCurrentUser
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-primary/10'
                                }`}
                              >
                                <FileText
                                  className={`w-6 h-6 ${
                                    mensaje.isFromCurrentUser
                                      ? 'text-primary-foreground'
                                      : 'text-primary'
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate mb-0.5">
                                  {attachment.name}
                                </p>
                                <p
                                  className={`text-xs ${
                                    mensaje.isFromCurrentUser
                                      ? 'text-primary-foreground/60'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                  mensaje.isFromCurrentUser
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-primary/10'
                                }`}
                              >
                                <Download
                                  className={`w-5 h-5 ${
                                    mensaje.isFromCurrentUser
                                      ? 'text-primary-foreground'
                                      : 'text-primary'
                                  }`}
                                />
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[10px] md:text-xs ${
                      mensaje.isFromCurrentUser
                        ? 'text-muted-foreground mr-1'
                        : 'text-muted-foreground ml-1'
                    }`}
                  >
                    <span>{formatTime(mensaje.timestamp)}</span>
                    {mensaje.isFromCurrentUser && mensaje.isRead && (
                      <span className="flex items-center gap-0.5">
                        <CheckCheck className="w-3 h-3" />
                        Leído
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
