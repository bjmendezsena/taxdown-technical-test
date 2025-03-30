import { DateValue } from '@/customer/domain';

describe('DateValue', () => {
  const fixedDate = new Date('2023-01-01T12:00:00Z');

  describe('creation', () => {
    it('should create with current date by default', () => {
      const dateValue = new DateValue();
      expect(dateValue.getValue()).toBeInstanceOf(Date);
    });

    it('should create with a given date', () => {
      const dateValue = new DateValue(fixedDate);
      expect(dateValue.getValue().getTime()).toBe(fixedDate.getTime());
    });

    it('should create from string using static method', () => {
      const dateStr = '2023-01-01T12:00:00.000Z';
      const dateValue = DateValue.fromString('2023-01-01T12:00:00Z');
      expect(dateValue.getValue().toISOString()).toBe(dateStr);
    });
  });

  describe('comparison', () => {
    it('should compare with another DateValue', () => {
      const date1 = new DateValue(fixedDate);
      const date2 = new DateValue(fixedDate);
      const differentDate = new DateValue(new Date('2023-01-02'));

      expect(date1.equals(date2)).toBe(true);
      expect(date1.equals(differentDate)).toBe(false);
    });

    it('should compare with Date object', () => {
      const dateValue = new DateValue(fixedDate);
      expect(dateValue.equals(fixedDate)).toBe(true);
      expect(dateValue.equals(new Date('2023-01-02'))).toBe(false);
    });

    it('should compare with string date', () => {
      const dateValue = new DateValue(fixedDate);
      expect(dateValue.equals('2023-01-01')).toBe(true);
      expect(dateValue.equals('2023-01-02')).toBe(false);
    });
  });

  describe('date operations', () => {
    it('should determine if date is after another', () => {
      const earlier = new DateValue(new Date('2023-01-01'));
      const later = new DateValue(new Date('2023-01-02'));

      expect(later.isAfter(earlier)).toBe(true);
      expect(earlier.isAfter(later)).toBe(false);
    });

    it('should determine if date is before another', () => {
      const earlier = new DateValue(new Date('2023-01-01'));
      const later = new DateValue(new Date('2023-01-02'));

      expect(earlier.isBefore(later)).toBe(true);
      expect(later.isBefore(earlier)).toBe(false);
    });

    it('should add days correctly', () => {
      const dateValue = new DateValue(fixedDate);
      const result = dateValue.addDays(5);

      expect(result.getValue().getDate()).toBe(6);
    });
  });

  describe('formatting and range operations', () => {
    it('should format date according to pattern', () => {
      const dateValue = new DateValue(fixedDate);
      expect(dateValue.format('yyyy-MM-dd')).toBe('2023-01-01');
    });
  });
});
