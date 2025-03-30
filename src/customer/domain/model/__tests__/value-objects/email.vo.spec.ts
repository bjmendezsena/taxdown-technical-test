import { Email, InvalidEmailException } from '@/customer/domain';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const TestEmailValue = 'test@example.com';
    const email = new Email(TestEmailValue);
    expect(email.getValue()).toBe(TestEmailValue);
  });

  it('should accept emails with subdomains', () => {
    const TestEmailValue = 'user@mail.domain.com';
    const email = new Email(TestEmailValue);
    expect(email.getValue()).toBe(TestEmailValue);
  });

  it('should accept emails with hyphens and dots', () => {
    const TestEmailValue = 'first.last-name@mail-server.com';
    const email = new Email(TestEmailValue);
    expect(email.getValue()).toBe(TestEmailValue);
  });

  it('should throw InvalidEmailException if email has no "@"', () => {
    expect(() => new Email('invalid-email')).toThrow(InvalidEmailException);
  });

  it('should throw InvalidEmailException for malformed email', () => {
    expect(() => new Email('test@.com')).toThrow(InvalidEmailException);
    expect(() => new Email('test@com')).toThrow(InvalidEmailException);
    expect(() => new Email('@domain.com')).toThrow(InvalidEmailException);
  });

  it('should return the exact email value via getValue()', () => {
    const raw = 'user@domain.com';
    const email = new Email(raw);
    expect(email.getValue()).toBe(raw);
  });
});
