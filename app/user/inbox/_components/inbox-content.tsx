'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactosApi } from '@/lib/contactos-api';
import { InboxSkeleton } from './inbox-skeleton';
import { InboxError } from './inbox-error';
import { InboxHeader } from './inbox-header';
import { InboxList } from './inbox-list';

export function InboxContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['contactos-inbox'],
    queryFn: () => contactosApi.inbox(),
  });

  const messages = data?.data ?? [];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (isLoading) return <InboxSkeleton />;
  if (isError) return <InboxError error={error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <InboxHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <InboxList
          messages={messages}
          searchQuery={searchQuery}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
