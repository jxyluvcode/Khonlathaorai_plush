import { Person, Item, Charges, PersonSummary } from './types';

/**
 * Calculate the bill summary for each person
 * Requirements: 4.1, 4.2, 4.5, 5.3, 5.4, 5.5
 */
export function calculateSummary(
  persons: Person[],
  items: Item[],
  charges: Charges
): PersonSummary[] {
  // Initialize summary for each person
  const summaries: PersonSummary[] = persons.map(person => ({
    personId: person.id,
    personName: person.name,
    subtotal: 0,
    serviceCharge: 0,
    tax: 0,
    total: 0
  }));

  // Calculate subtotal for each person based on shared items
  items.forEach(item => {
    const shareCount = item.sharedBy.length;
    if (shareCount === 0) return;
    
    const amountPerPerson = item.price / shareCount;
    
    item.sharedBy.forEach(personId => {
      const summary = summaries.find(s => s.personId === personId);
      if (summary) {
        summary.subtotal += amountPerPerson;
      }
    });
  });

  // Calculate service charge and tax for each person
  summaries.forEach(summary => {
    summary.serviceCharge = summary.subtotal * (charges.serviceCharge / 100);
    summary.tax = summary.subtotal * (charges.tax / 100);
    summary.total = summary.subtotal + summary.serviceCharge + summary.tax;
  });

  return summaries;
}

/**
 * Format amount in Thai Baht currency
 * Requirements: 4.5
 */
export function formatCurrency(amount: number): string {
  return `฿${amount.toFixed(2)}`;
}
