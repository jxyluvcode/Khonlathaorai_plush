import React from 'react';
import { Separator as AriaSeparator, SeparatorProps as AriaSeparatorProps } from 'react-aria-components';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends AriaSeparatorProps {}

export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <AriaSeparator
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
}
