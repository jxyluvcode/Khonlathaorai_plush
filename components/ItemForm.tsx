'use client';

import { useState } from 'react';
import { Form } from 'react-aria-components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Checkbox, CheckboxGroup } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Note } from '@/components/ui/note';
import { Person, Item } from '@/lib/types';

interface ItemFormProps {
  persons: Person[];
  onAddItem: (item: Omit<Item, 'id'>) => { success: boolean; error?: string };
  onUpdateItem?: (id: string, item: Partial<Item>) => { success: boolean; error?: string };
  editingItem?: Item | null;
  onCancelEdit?: () => void;
}

/**
 * ItemForm component for adding and editing items
 * Requirements: 2.1, 2.2, 3.1, 3.2
 */
export function ItemForm({ 
  persons, 
  onAddItem, 
  onUpdateItem, 
  editingItem = null,
  onCancelEdit 
}: ItemFormProps) {
  const [itemName, setItemName] = useState(editingItem?.name || '');
  const [price, setPrice] = useState(editingItem?.price.toString() || '');
  const [selectedPersons, setSelectedPersons] = useState<string[]>(editingItem?.sharedBy || []);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    itemName?: string;
    price?: string;
    selectedPersons?: string;
  }>({});

  const isEditMode = editingItem !== null;

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    // Validate item name
    const trimmedName = itemName.trim();
    if (!trimmedName) {
      errors.itemName = 'Item name cannot be empty';
      isValid = false;
    } else if (trimmedName.length > 100) {
      errors.itemName = 'Item name cannot exceed 100 characters';
      isValid = false;
    }

    // Validate price
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum)) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (priceNum <= 0) {
      errors.price = 'Price must be greater than zero';
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      errors.price = 'Price must have at most 2 decimal places';
      isValid = false;
    }

    // Validate person selection
    if (selectedPersons.length === 0) {
      errors.selectedPersons = 'At least one person must be selected';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const itemData = {
      name: itemName.trim(),
      price: parseFloat(price),
      sharedBy: selectedPersons
    };

    let result;
    if (isEditMode && editingItem && onUpdateItem) {
      result = onUpdateItem(editingItem.id, itemData);
    } else {
      result = onAddItem(itemData);
    }

    if (result.success) {
      // Reset form
      setItemName('');
      setPrice('');
      setSelectedPersons([]);
      setValidationErrors({});
      setError(null);
      
      if (isEditMode && onCancelEdit) {
        onCancelEdit();
      }
    } else {
      setError(result.error || 'Failed to save item');
    }
  };

  const handleCancel = () => {
    setItemName('');
    setPrice('');
    setSelectedPersons([]);
    setValidationErrors({});
    setError(null);
    
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isEditMode) {
      e.preventDefault();
      handleCancel();
    }
  };

  const handlePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <Card className='shadow-xl'>
      <CardHeader>
        <CardTitle>{isEditMode ? 'เเก้ไขรายการอาหาร' : 'เพิ่มรายการอาหาร'}</CardTitle>
      </CardHeader>
      <CardContent onKeyDown={handleKeyDown}>
        <Form onSubmit={handleSubmit} className="space-y-4" aria-label={isEditMode ? 'Edit item form' : 'Add item form'}>
          {/* Item name field */}
          <TextField
            label="ชื่อ"
            value={itemName}
            onChange={setItemName}
            isInvalid={!!validationErrors.itemName}
            errorMessage={validationErrors.itemName}
            isRequired
            aria-label="Item name"
          />

          {/* Price field */}
          <TextField
            label="ราคา (฿)"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={handlePriceChange}
            isInvalid={!!validationErrors.price}
            errorMessage={validationErrors.price}
            isRequired
            aria-label="Item price"
          />

          {/* Person selection */}
          {persons.length > 0 ? (
            <CheckboxGroup
              label="หารกับใครบ้าง"
              value={selectedPersons}
              onChange={setSelectedPersons}
              isInvalid={!!validationErrors.selectedPersons}
              errorMessage={validationErrors.selectedPersons}
              isRequired
              aria-label="Select persons sharing this item"
            >
              {persons.map((person) => (
                <Checkbox
                  key={person.id}
                  value={person.id}
                  label={person.name}
                />
              ))}
            </CheckboxGroup>
          ) : (
            <Note variant="warning" className="animate-slide-in text-primary">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className='border-primary-foreground'>กรุณาเพิ่มรายชื่อเพื่อนก่อน !!</span>
              </div>
            </Note>
          )}

          {/* Form-level error display */}
          {error && (
            <Note variant="destructive" className="animate-slide-in">
              {error}
            </Note>
          )}

          {/* Submit and cancel buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              type="submit"
              isDisabled={persons.length === 0}
              aria-label={isEditMode ? 'Update item' : 'Add item'}
              className={isEditMode ? "w-full sm:w-auto bg-amber-400 text-secondary" : "w-full sm:w-auto bg-green-400 text-secondary"}
            >
              {isEditMode ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}
            </Button>
            
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onPress={handleCancel}
                aria-label="Cancel editing"
                className="w-full sm:w-auto"
              >
                ยกเลิก
              </Button>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
