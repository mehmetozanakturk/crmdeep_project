import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-600 text-white dark:bg-primary-500',
        secondary: 'border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
        destructive: 'border-transparent bg-danger-600 text-white',
        success: 'border-transparent bg-success-600 text-white',
        warning: 'border-transparent bg-warning-600 text-white',
        outline: 'text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
