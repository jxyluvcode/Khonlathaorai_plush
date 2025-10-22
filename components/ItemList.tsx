'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, Column, Row, Cell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, Person } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface ItemListProps {
  items: Item[];
  persons: Person[];
  onEditItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
}

/**
 * ItemList component for displaying items with responsive layout
 * Requirements: 2.3, 2.4, 2.5, 3.3
 */
export function ItemList({ items, persons, onEditItem, onRemoveItem }: ItemListProps) {
  // Calculate total bill amount
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);

  // Helper to get person names from IDs
  const getPersonNames = (personIds: string[]): string[] => {
    return personIds
      .map(id => persons.find(p => p.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  };

  // Empty state
  if (items.length === 0) {
    return (
      <Card className='shadow-xl transition-all duration-300 ease-in-out hover:text-amber-400'>
        <CardHeader>
          <CardTitle>สินค้า</CardTitle>
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              ยังไม่มีรายการอาหาร
            </p>
            <p className="text-xs text-muted-foreground">
              เพิ่มรายการอาหารก่อนเพื่อทำการ หาร ค่าอาหาร
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>อาหาร</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop view - Table */}
        <div className="hidden md:block">
          <Table aria-label="Items list">
            <TableHeader>
              <Column isRowHeader>ชื่อ</Column>
              <Column>ราคา</Column>
              <Column>หารใครบ้าง By</Column>
              <Column>ปรับเเต่ง</Column>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const sharedPersons = getPersonNames(item.sharedBy);
                return (
                  <Row key={item.id}>
                    <Cell>{item.name}</Cell>
                    <Cell>{formatCurrency(item.price)}</Cell>
                    <Cell>
                      <div className="flex flex-wrap gap-1">
                        {sharedPersons.map((name, index) => (
                          <Badge key={index} intent='primary' className='bg-green-500 text-white'>
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </Cell>
                    <Cell>
                      <div className="flex gap-2">
                        <Button
                          className="bg-amber-300 text-black"
                          size="sm"
                          variant="outline"
                          onPress={() => onEditItem(item)}
                          aria-label={`Edit ${item.name}`}
                        >
                          เเก้ไข
                        </Button>
                        <Button
                          className="bg-red-500 text-white"
                          size="sm"
                          variant="destructive"
                          onPress={() => onRemoveItem(item.id)}
                          aria-label={`Delete ${item.name}`}
                        >
                          ลบ
                        </Button>
                      </div>
                    </Cell>
                  </Row>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view - Cards */}
        <div className="md:hidden space-y-4">
          {items.map((item) => {
            const sharedPersons = getPersonNames(item.sharedBy);
            return (
              <div
                key={item.id}
                className="rounded-lg border p-4 bg-background space-y-3 animate-fade-in hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base">{item.name}</h4>
                    <p className="text-xl font-semibold text-primary mt-1">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Shared by:</p>
                  <div className="flex flex-wrap gap-2">
                    {sharedPersons.map((name, index) => (
                      <Badge key={index} intent="secondary" className="text-sm bg-green-500 text-white">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => onEditItem(item)}
                    aria-label={`Edit ${item.name}`}
                    className="flex-1 w-full"
                  >
                    เเก้ไข
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onPress={() => onRemoveItem(item.id)}
                    aria-label={`Delete ${item.name}`}
                    className="flex-1 w-full"
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total bill amount */}
        <div className="mt-6 pt-4 border-t animate-fade-in" role="region" aria-label="Total bill amount">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold" id="total-bill-label">ราคาสุทธิ:</span>
            <span className="text-xl sm:text-2xl font-bold text-primary" aria-labelledby="total-bill-label">
              {formatCurrency(totalBill)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
