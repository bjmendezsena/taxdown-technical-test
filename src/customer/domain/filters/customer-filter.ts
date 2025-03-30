export type SortDirection = 'asc' | 'desc';

export interface CustomerFilter {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  sortBy?: 'credit' | 'createdAt';
  sortDirection?: SortDirection;
  limit?: number;
  page?: number;
}
