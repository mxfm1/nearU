import { Pagination } from '@/components/ui/pagination';

interface InboxPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function InboxPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: InboxPaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      className={className}
    />
  );
}
