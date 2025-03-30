import { InvalidPhoneException, Phone } from '@/customer/domain';

describe('Phone Value Object', () => {
  it('should create a valid phone number with country code', () => {
    const TestPhoneValue = '+18095551234';
    const phone = new Phone(TestPhoneValue);
    expect(phone.getValue()).toBe(TestPhoneValue);
  });

  it('should accept phone number with spaces', () => {
    const TestPhoneValue = '+1 809 555 1234';
    const phone = new Phone(TestPhoneValue);
    expect(phone.getValue()).toBe(TestPhoneValue);
  });

  it('should accept phone number with parentheses and hyphens', () => {
    const TestPhoneValue = '(809)-555-1234';
    const phone = new Phone(TestPhoneValue);
    expect(phone.getValue()).toBe(TestPhoneValue);
  });

  it('should throw InvalidPhoneException for too short number', () => {
    expect(() => new Phone('123')).toThrow(InvalidPhoneException);
  });

  it('should throw InvalidPhoneException for too long number', () => {
    expect(() => new Phone('+123456789012345678901')).toThrow(
      InvalidPhoneException,
    );
  });

  it('should throw InvalidPhoneException for invalid characters', () => {
    expect(() => new Phone('+1809abc123')).toThrow(InvalidPhoneException);
  });

  it('should return the correct phone value via getValue()', () => {
    const raw = '+1 809 555 1234';
    const phone = new Phone(raw);
    expect(phone.getValue()).toBe(raw);
  });
});
