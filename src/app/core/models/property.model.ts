export interface Property {
  id: string;
  title: string;
  description: string;

  address: string;
  city: string;
  state: string;

  rent: number;

  bedrooms: number;
  bathrooms: number;
  squareFeet: number;

  furnished: boolean;

  leaseType: 'LONG_TERM' | 'SHORT_TERM' | 'BOTH';

  amenities: string[];

  images: string[];

  ownerId: string;

  featured: boolean;

  createdAt: string;
}