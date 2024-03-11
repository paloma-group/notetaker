import { cn } from '@/utils/tailwind/cn';
import { HTMLAttributes } from 'react';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-500/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
