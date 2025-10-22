import React from 'react';
import {
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  Label,
  Input,
  Text,
  FieldError,
} from 'react-aria-components';
import { cn } from '@/lib/utils';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: any) => string);
}

export function TextField({
  label,
  description,
  errorMessage,
  className,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField className={cn('flex flex-col gap-2', className)} {...props}>
      {label && (
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </Label>
      )}
      <Input
        className={cn(
          'flex h-11 min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />
      {description && (
        <Text slot="description" className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}
      <FieldError className="text-sm font-medium text-destructive">
        {errorMessage}
      </FieldError>
    </AriaTextField>
  );
}
