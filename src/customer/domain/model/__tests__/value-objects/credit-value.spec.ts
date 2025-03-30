import { Credit, InvalidCreditException } from '@/customer/domain';

describe('Credit', () => {
  describe('creation', () => {
    it('should create a Credit with default value of 0', () => {
      const credit = new Credit();
      expect(credit.getValue()).toBe(0);
    });

    it('should create a Credit with a given amount', () => {
      const credit = new Credit(100);
      expect(credit.getValue()).toBe(100);
    });

    it('should throw InvalidCreditException for invalid amounts', () => {
      expect(() => new Credit(NaN)).toThrow(InvalidCreditException);
      expect(() => new Credit(Infinity)).toThrow(InvalidCreditException);
    });
  });

  describe('value validation', () => {
    it('should correctly identify positive values', () => {
      const credit = new Credit(100);
      expect(credit.isPositive()).toBe(true);
    });

    it('should identify zero as positive', () => {
      const credit = new Credit(0);
      expect(credit.isPositive()).toBe(true);
    });
  });

  describe('arithmetic operations', () => {
    it('should add credits correctly', () => {
      const credit1 = new Credit(100);
      const credit2 = new Credit(200);

      credit1.add(credit2);

      expect(credit1.getValue()).toBe(300);
    });

    it('should handle decimal additions correctly', () => {
      const credit1 = new Credit(10.5);
      const credit2 = new Credit(20.7);

      credit1.add(credit2);

      expect(credit1.getValue()).toBe(31.2);
    });
  });

  describe('currency conversions', () => {
    it('should convert to cents and back maintaining value', () => {
      const credit = new Credit(1.5);

      credit.toCents();
      expect(credit.getValue()).toBe(150);

      credit.toCreditUnit();
      expect(credit.getValue()).toBe(1.5);
    });

    it('should round values correctly', () => {
      const credit = new Credit(1.555);
      credit.round();
      expect(credit.getValue()).toBe(2);
    });
  });
});
