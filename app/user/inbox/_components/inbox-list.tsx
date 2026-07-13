'use client'

import { useMemo } from 'react'
import type { ContactoResumen } from '@/lib/contactos-api'
import { InboxCard } from './inbox-card'
import { InboxEmpty } from './inbox-empty'
import { InboxPagination } from './inbox-pagination'

const ITEMS_PER_PAGE = 5

interface InboxListProps {
  messages: ContactoResumen[]
  searchQuery: string
  currentPage: number
  onPageChange: (page: number) => void
}

export function InboxList({ messages, searchQuery, currentPage, onPageChange }: InboxListProps) {
  const filteredMessages = useMemo(
    () =>
      messages.filter(
        (msg) =>
          msg.remitente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (msg.ultimoMensaje ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [messages, searchQuery],
  )

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / ITEMS_PER_PAGE))
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  if (filteredMessages.length === 0) {
    return <InboxEmpty searchQuery={searchQuery} />
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {paginatedMessages.map((msg) => (
          <InboxCard key={msg.id} message={msg} />
        ))}
      </div>

      {totalPages > 1 && (
        <InboxPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      )}
    </>
  )
}
