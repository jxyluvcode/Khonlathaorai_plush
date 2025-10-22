import React from 'react';
import {
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  TableBody as AriaTableBody,
  Column as AriaColumn,
  Row as AriaRow,
  Cell as AriaCell,
  TableProps as AriaTableProps,
  TableHeaderProps as AriaTableHeaderProps,
  TableBodyProps as AriaTableBodyProps,
  ColumnProps as AriaColumnProps,
  CellProps as AriaCellProps,
} from 'react-aria-components';
import { cn } from '@/lib/utils';

export interface TableProps extends AriaTableProps {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <AriaTable
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

export interface TableHeaderProps extends AriaTableHeaderProps<any> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <AriaTableHeader
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
}

export interface TableBodyProps extends AriaTableBodyProps<any> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <AriaTableBody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

export interface ColumnProps extends AriaColumnProps {}

export function Column({ className, ...props }: ColumnProps) {
  return (
    <AriaColumn
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export interface RowProps extends React.ComponentPropsWithoutRef<typeof AriaRow> {}

export function Row({ className, ...props }: RowProps) {
  return (
    <AriaRow
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[selected]:bg-muted',
        className
      )}
      {...props}
    />
  );
}

export interface CellProps extends AriaCellProps {}

export function Cell({ className, ...props }: CellProps) {
  return (
    <AriaCell
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}
