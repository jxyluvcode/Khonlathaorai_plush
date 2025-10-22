'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PersonSummary } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  summary: PersonSummary[];
  onViewDetail?: () => void;
}

/**
 * SummaryCard component displays the bill breakdown for each person
 * Requirements: 4.1, 4.2, 4.3, 4.5, 5.5
 */
export function SummaryCard({ summary, onViewDetail }: SummaryCardProps) {
  // Calculate grand total
  const grandTotal = summary.reduce((sum, person) => sum + person.total, 0);
  const totalSubtotal = summary.reduce((sum, person) => sum + person.subtotal, 0);
  const totalServiceCharge = summary.reduce((sum, person) => sum + person.serviceCharge, 0);
  const totalTax = summary.reduce((sum, person) => sum + person.tax, 0);

  // Handle empty state when no persons exist
  if (summary.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>เงินที่ต้องของเเต่ละคน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 px-4 rounded-lg bg-muted/30">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              ยังไม่มีผลรวม
            </p>
            {/* <p className="text-xs text-muted-foreground">
              Add persons and items to see the bill breakdown
            </p> */}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>เงินที่ต้องจ่ายของแต่ละคน</CardTitle>
          {summary.length > 0 && onViewDetail && (
            <Button
              size="sm"
              variant="outline"
              onPress={onViewDetail}
              className="gap-2 shrink-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              ดูบิลสรุป
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {summary.map((person) => (
          <section
            key={person.personId}
            className="space-y-2 sm:space-y-3 pb-4 sm:pb-5 border-b last:border-b-0 last:pb-0 animate-fade-in"
            aria-labelledby={`person-${person.personId}-name`}
          >
            {/* Person name */}
            <h4 id={`person-${person.personId}-name`} className="font-semibold text-base sm:text-lg ">{person.personName}</h4>

            {/* Breakdown details */}
            <dl className="space-y-1.5 text-sm sm:text-base">
              <div className="flex justify-between gap-4 text-muted-foreground">
                <dt>ราคา:</dt>
                <dd className="font-medium">{formatCurrency(person.subtotal)}</dd>
              </div>

              {person.serviceCharge > 0 && (
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Service Charge:</dt>
                  <dd className="font-medium">{formatCurrency(person.serviceCharge)}</dd>
                </div>
              )}

              {person.tax > 0 && (
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Tax:</dt>
                  <dd className="font-medium">{formatCurrency(person.tax)}</dd>
                </div>
              )}
            </dl>

            {/* Total amount with distinct styling */}
            <div className={cn(
              "flex justify-between items-center gap-4 pt-2 mt-2 border-t",
              "font-bold text-lg sm:text-xl"
            )}>
              <span>รวม:</span>
              <span className="text-primary" aria-label={`Total amount for ${person.personName}`}>{formatCurrency(person.total)}</span>
            </div>
          </section>
        ))}

        {/* Grand Total Section */}
        {summary.length > 1 && (
          <section
            className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 border-t-2 border-primary/20 bg-primary/5 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg"
            aria-label="ยอดรวมทั้งหมด"
          >
            <h4 className="font-bold text-base sm:text-lg text-primary">ยอดรวมทั้งหมด</h4>

            {/* Breakdown details */}
            <dl className="space-y-1.5 text-sm sm:text-base">
              <div className="flex justify-between gap-4 text-muted-foreground">
                <dt>ราคารวม:</dt>
                <dd className="font-medium">{formatCurrency(totalSubtotal)}</dd>
              </div>

              {totalServiceCharge > 0 && (
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Service Charge:</dt>
                  <dd className="font-medium">{formatCurrency(totalServiceCharge)}</dd>
                </div>
              )}

              {totalTax > 0 && (
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <dt>Tax:</dt>
                  <dd className="font-medium">{formatCurrency(totalTax)}</dd>
                </div>
              )}
            </dl>

            {/* Grand Total with prominent styling */}
            <div className={cn(
              "flex justify-between items-center gap-4 pt-3 mt-3 border-t-2 border-primary/30",
              "font-bold text-xl sm:text-2xl text-primary"
            )}>
              <span>ยอดรวมสุทธิ:</span>
              <span aria-label="Grand total amount">{formatCurrency(grandTotal)}</span>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
