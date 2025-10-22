import React from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxProps as AriaCheckboxProps,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  Label,
  FieldError,
} from 'react-aria-components';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'children'> {
  label?: string;
  children?: React.ReactNode;
}

export function Checkbox({ label, className, children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      className={cn(
        'group flex items-center gap-3 text-sm sm:text-base font-medium leading-none min-h-[44px] py-2',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {() => (
        <>
          <div
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-primary',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground'
            )}
          >
            <svg
              className="h-4 w-4 fill-current opacity-0 group-data-[selected]:opacity-100"
              viewBox="0 0 12 10"
            >
              <path d="M4.5 7.5L1.5 4.5L0.5 5.5L4.5 9.5L11.5 2.5L10.5 1.5L4.5 7.5Z" />
            </svg>
          </div>
          {label || children}
        </>
      )}
    </AriaCheckbox>
  );
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, 'children'> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: any) => string);
  children?: React.ReactNode;
}

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup className={cn('flex flex-col gap-2', className)} {...props}>
      {() => (
        <>
          {label && (
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </Label>
          )}
          <div className="flex flex-col gap-1">{children}</div>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
          <FieldError className="text-sm font-medium text-destructive">
            {errorMessage}
          </FieldError>
        </>
      )}
    </AriaCheckboxGroup>
  );
}
