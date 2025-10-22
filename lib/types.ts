export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  sharedBy: string[]; // Array of person IDs
}

export interface Charges {
  serviceCharge: number; // Percentage (0-100)
  tax: number;          // Percentage (0-100)
}

export interface PersonSummary {
  personId: string;
  personName: string;
  subtotal: number;
  serviceCharge: number;
  tax: number;
  total: number;
}

export interface BillState {
  persons: Person[];
  items: Item[];
  charges: Charges;
}
