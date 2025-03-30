import { CustomerFilter } from '@/customer/domain';

describe('CustomerFilter', () => {
  describe('type validation', () => {
    it('should accept valid filter properties', () => {
      const validFilter: CustomerFilter = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        sortBy: 'credit',
        sortDirection: 'asc',
        limit: 10,
        page: 1,
      };

      expect(validFilter).toBeDefined();
    });

    it('should accept partial filter properties', () => {
      const partialFilter: CustomerFilter = {
        firstName: 'John',
        sortBy: 'createdAt',
      };

      expect(partialFilter).toBeDefined();
    });

    it('should accept empty filter', () => {
      const emptyFilter: CustomerFilter = {};

      expect(emptyFilter).toBeDefined();
    });
  });

  describe('SortDirection', () => {
    it('should accept valid sort directions', () => {
      const ascFilter: CustomerFilter = {
        sortDirection: 'asc',
      };
      const descFilter: CustomerFilter = {
        sortDirection: 'desc',
      };

      expect(ascFilter.sortDirection).toBe('asc');
      expect(descFilter.sortDirection).toBe('desc');
    });
  });

  describe('sortBy', () => {
    it('should accept valid sort fields', () => {
      const creditSort: CustomerFilter = {
        sortBy: 'credit',
      };
      const dateSort: CustomerFilter = {
        sortBy: 'createdAt',
      };

      expect(creditSort.sortBy).toBe('credit');
      expect(dateSort.sortBy).toBe('createdAt');
    });
  });

  describe('pagination', () => {
    it('should accept valid pagination values', () => {
      const paginatedFilter: CustomerFilter = {
        limit: 20,
        page: 2,
      };

      expect(paginatedFilter.limit).toBe(20);
      expect(paginatedFilter.page).toBe(2);
    });
  });

  describe('type compilation', () => {
    it('should compile with all optional properties', () => {
      const filters: CustomerFilter[] = [
        { firstName: 'John' },
        { lastName: 'Doe' },
        { email: 'test@example.com' },
        { phone: '+1234567890' },
        { sortBy: 'credit' },
        { sortBy: 'createdAt' },
        { sortDirection: 'asc' },
        { sortDirection: 'desc' },
        { limit: 10 },
        { page: 1 },
        {}, // empty filter
      ];

      expect(filters).toHaveLength(11);
    });
  });
});
