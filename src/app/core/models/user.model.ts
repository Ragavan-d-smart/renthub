export type UserRole = 'LANDLORD' | 'RENTER';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}