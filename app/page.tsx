'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useBillSplitting } from '@/hooks/useBillSplitting';
import { PersonList } from '@/components/PersonList';
import { ItemForm } from '@/components/ItemForm';
import { ItemList } from '@/components/ItemList';
import { ChargesForm } from '@/components/ChargesForm';
import { SummaryCard } from '@/components/SummaryCard';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { BillSummaryModal } from '@/components/BillSummaryModal';
import { Item } from '@/lib/types';

/**
 * Main page for Bill Splitting App
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export default function Home() {
  const {
    persons,
    items,
    charges,
    summary,
    addPerson,
    removePerson,
    addItem,
    updateItem,
    removeItem,
    updateCharges
  } = useBillSplitting();

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
  };

  const handleViewBillDetail = () => {
    setShowBillModal(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleUpdateItem = (id: string, itemData: Partial<Item>) => {
    const result = updateItem(id, itemData);
    if (result.success) {
      setEditingItem(null);
      toast.success('แก้ไขรายการเรียบร้อย');
    }
    return result;
  };

  const handleAddItem = (itemData: Omit<Item, 'id'>) => {
    const result = addItem(itemData);
    if (result.success) {
      toast.success('เพิ่มรายการเรียบร้อย');
    }
    return result;
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('ลบรายการเรียบร้อย');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b sticky top-0 z-50 shadow-sm transition-colors bg-background" role="banner">
        <div className="container mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                คนละเท่าไหร่ +
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                แบ่งค่าอาหารง่ายๆ กับเพื่อน
              </p>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8 max-w-7xl" role="main">
        {/* Live region for dynamic updates */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {persons.length > 0 && `${persons.length} person${persons.length !== 1 ? 's' : ''} added. `}
          {items.length > 0 && `${items.length} item${items.length !== 1 ? 's' : ''} in the bill.`}
        </div>

        {/* Mobile & Tablet: Single column layout */}
        <div className="lg:hidden space-y-4 sm:space-y-6">
          <PersonList
            persons={persons}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
          />

          <ItemForm
            persons={persons}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
          />

          <ItemList
            items={items}
            persons={persons}
            onEditItem={handleEditItem}
            onRemoveItem={handleRemoveItem}
          />

          <ChargesForm
            charges={charges}
            onUpdateCharges={updateCharges}
          />

          <SummaryCard summary={summary} onViewDetail={handleViewBillDetail} />
        </div>

        {/* Desktop: Multi-column layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {/* Left column: Person and Item management */}
          <div className="lg:col-span-2 space-y-6" role="region" aria-label="Bill management">
            <PersonList
              persons={persons}
              onAddPerson={addPerson}
              onRemovePerson={removePerson}
            />

            <ItemForm
              persons={persons}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              editingItem={editingItem}
              onCancelEdit={handleCancelEdit}
            />

            <ItemList
              items={items}
              persons={persons}
              onEditItem={handleEditItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Right column: Charges and Summary (sticky on desktop) */}
          <div className="space-y-6" role="region" aria-label="Bill summary">
            <div className="sticky top-24 space-y-6">
              <ChargesForm
                charges={charges}
                onUpdateCharges={updateCharges}
              />

              <SummaryCard summary={summary} onViewDetail={handleViewBillDetail} />
            </div>
          </div>
        </div>
      </main>

      {/* Bill Summary Modal */}
      <BillSummaryModal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        persons={persons}
        items={items}
        charges={charges}
        summary={summary}
      />
    </div>
  );
}
