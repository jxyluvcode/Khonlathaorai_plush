import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

const noteVariants = tv({
  base: 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      warning: 'border-yellow-500/50 text-yellow-900 dark:border-yellow-500 [&>svg]:text-yellow-900',
      success: 'border-green-500/50 text-green-900 dark:border-green-500 [&>svg]:text-green-900',
      info: 'border-blue-500/50 text-blue-900 dark:border-blue-500 [&>svg]:text-blue-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface NoteProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof noteVariants> {}

export function Note({ className, variant, ...props }: NoteProps) {
  return (
    <div
      role="alert"
      className={cn(noteVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface NoteTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function NoteTitle({ className, ...props }: NoteTitleProps) {
  return (
    <h5
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface NoteDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function NoteDescription({ className, ...props }: NoteDescriptionProps) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}
