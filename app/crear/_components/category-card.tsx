'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryCard({ icon: Icon, label, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-200',
        isSelected
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <Icon className={cn('h-6 w-6', isSelected ? 'text-primary' : 'text-muted-foreground')} />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
