import { useState, useMemo } from 'react';
import { Person, Item, Charges, PersonSummary } from '@/lib/types';
import { calculateSummary } from '@/lib/calculations';

/**
 * Custom hook for managing bill splitting state and actions
 * Requirements: 1.1, 1.2, 1.3, 2.1, 2.3, 2.4, 3.1, 3.4, 4.4, 5.1, 5.2
 */
export function useBillSplitting() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [charges, setCharges] = useState<Charges>({
    serviceCharge: 0,
    tax: 0
  });

  /**
   * Add a new person with validation
   * Requirements: 1.1, 1.2
   * Validation: no empty names, no duplicates, max 50 characters
   */
  const addPerson = (name: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    
    // Validate: no empty names
    if (!trimmedName) {
      return { success: false, error: 'Person name cannot be empty' };
    }
    
    // Validate: max 50 characters
    if (trimmedName.length > 50) {
      return { success: false, error: 'Person name cannot exceed 50 characters' };
    }
    
    // Validate: no duplicates (case-insensitive)
    const isDuplicate = persons.some(
      person => person.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'Person name already exists' };
    }
    
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: trimmedName
    };
    
    setPersons(prev => [...prev, newPerson]);
    return { success: true };
  };

  /**
   * Remove a person and update items that reference them
   * Requirements: 1.3
   */
  const removePerson = (id: string): void => {
    setPersons(prev => prev.filter(person => person.id !== id));
    
    // Remove person from all items' sharedBy arrays
    setItems(prev => prev.map(item => ({
      ...item,
      sharedBy: item.sharedBy.filter(personId => personId !== id)
    })));
  };

  /**
   * Add a new item with validation
   * Requirements: 2.1, 3.1
   */
  const addItem = (itemData: Omit<Item, 'id'>): { success: boolean; error?: string } => {
    const trimmedName = itemData.name.trim();
    
    // Validate: item name cannot be empty
    if (!trimmedName) {
      return { success: false, error: 'Item name cannot be empty' };
    }
    
    // Validate: max 100 characters
    if (trimmedName.length > 100) {
      return { success: false, error: 'Item name cannot exceed 100 characters' };
    }
    
    // Validate: price must be positive
    if (itemData.price <= 0) {
      return { success: false, error: 'Price must be greater than zero' };
    }
    
    // Validate: max 2 decimal places
    if (!Number.isFinite(itemData.price) || !/^\d+(\.\d{1,2})?$/.test(itemData.price.toString())) {
      return { success: false, error: 'Price must have at most 2 decimal places' };
    }
    
    // Validate: at least one person must be selected
    if (itemData.sharedBy.length === 0) {
      return { success: false, error: 'At least one person must be selected' };
    }
    
    // Validate: selected persons must exist
    const validPersonIds = new Set(persons.map(p => p.id));
    const invalidPersons = itemData.sharedBy.filter(id => !validPersonIds.has(id));
    if (invalidPersons.length > 0) {
      return { success: false, error: 'Selected persons do not exist' };
    }
    
    const newItem: Item = {
      id: crypto.randomUUID(),
      name: trimmedName,
      price: itemData.price,
      sharedBy: itemData.sharedBy
    };
    
    setItems(prev => [...prev, newItem]);
    return { success: true };
  };

  /**
   * Update an existing item with validation
   * Requirements: 2.3, 3.4
   */
  const updateItem = (id: string, itemData: Partial<Item>): { success: boolean; error?: string } => {
    const existingItem = items.find(item => item.id === id);
    if (!existingItem) {
      return { success: false, error: 'Item not found' };
    }
    
    const updatedItem = { ...existingItem, ...itemData };
    
    // Validate name if provided
    if (itemData.name !== undefined) {
      const trimmedName = itemData.name.trim();
      if (!trimmedName) {
        return { success: false, error: 'Item name cannot be empty' };
      }
      if (trimmedName.length > 100) {
        return { success: false, error: 'Item name cannot exceed 100 characters' };
      }
      updatedItem.name = trimmedName;
    }
    
    // Validate price if provided
    if (itemData.price !== undefined) {
      if (itemData.price <= 0) {
        return { success: false, error: 'Price must be greater than zero' };
      }
      if (!Number.isFinite(itemData.price) || !/^\d+(\.\d{1,2})?$/.test(itemData.price.toString())) {
        return { success: false, error: 'Price must have at most 2 decimal places' };
      }
    }
    
    // Validate sharedBy if provided
    if (itemData.sharedBy !== undefined) {
      if (itemData.sharedBy.length === 0) {
        return { success: false, error: 'At least one person must be selected' };
      }
      const validPersonIds = new Set(persons.map(p => p.id));
      const invalidPersons = itemData.sharedBy.filter(id => !validPersonIds.has(id));
      if (invalidPersons.length > 0) {
        return { success: false, error: 'Selected persons do not exist' };
      }
    }
    
    setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
    return { success: true };
  };

  /**
   * Remove an item
   * Requirements: 2.4
   */
  const removeItem = (id: string): void => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Update service charge and tax percentages
   * Requirements: 5.1, 5.2
   */
  const updateCharges = (newCharges: Partial<Charges>): { success: boolean; error?: string } => {
    const updatedCharges = { ...charges, ...newCharges };
    
    // Validate: service charge must be between 0 and 100
    if (updatedCharges.serviceCharge < 0 || updatedCharges.serviceCharge > 100) {
      return { success: false, error: 'Service charge must be between 0 and 100' };
    }
    
    // Validate: tax must be between 0 and 100
    if (updatedCharges.tax < 0 || updatedCharges.tax > 100) {
      return { success: false, error: 'Tax must be between 0 and 100' };
    }
    
    setCharges(updatedCharges);
    return { success: true };
  };

  /**
   * Calculate summary with memoization for performance
   * Requirements: 4.4
   */
  const summary = useMemo<PersonSummary[]>(
    () => calculateSummary(persons, items, charges),
    [persons, items, charges]
  );

  return {
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
  };
}
