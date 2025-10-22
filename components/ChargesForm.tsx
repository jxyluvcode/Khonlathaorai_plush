'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Note } from '@/components/ui/note';
import { Charges } from '@/lib/types';

interface ChargesFormProps {
  charges: Charges;
  onUpdateCharges: (charges: Partial<Charges>) => { success: boolean; error?: string };
}

/**
 * ChargesForm component for managing service charge and tax percentages
 * Requirements: 5.1, 5.2
 */
export function ChargesForm({ charges, onUpdateCharges }: ChargesFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleServiceChargeChange = (value: string) => {
    // Allow only numbers and decimal point with up to 2 decimal places
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    const numValue = value === '' ? 0 : parseFloat(value);

    const result = onUpdateCharges({ serviceCharge: numValue });
    if (!result.success) {
      setError(result.error || 'Failed to update service charge');
    } else {
      setError(null);
    }
  };

  const handleTaxChange = (value: string) => {
    // Allow only numbers and decimal point with up to 2 decimal places
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    const numValue = value === '' ? 0 : parseFloat(value);

    const result = onUpdateCharges({ tax: numValue });
    if (!result.success) {
      setError(result.error || 'Failed to update tax');
    } else {
      setError(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>เซอร์วิสชาร์จ & ภาษี</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset className="space-y-4">
          <legend className="sr-only">Service charge and tax percentages</legend>

          {/* Service charge input */}
          <TextField
            label="เซอร์วิสชาร์จ (%)"
            type="text"
            inputMode="decimal"
            value={charges.serviceCharge.toString()}
            onChange={handleServiceChargeChange}
            aria-label="Service charge percentage"
            aria-describedby="charges-help"
          />

          {/* Tax input */}
          <TextField
            label="ภาษี (%)"
            type="text"
            inputMode="decimal"
            value={charges.tax.toString()}
            onChange={handleTaxChange}
            aria-label="Tax percentage"
            aria-describedby="charges-help"
          />

          {/* Validation error display */}
          {error && (
            <Note variant="destructive" className="animate-slide-in">
              {error}
            </Note>
          )}

          {/* Helper text */}
          {/* <p id="charges-help" className="text-xs text-muted-foreground">
          Enter percentages between 0 and 100. These will be applied to each person's subtotal.
        </p> */}
        </fieldset>
      </CardContent>
    </Card>
  );
}
