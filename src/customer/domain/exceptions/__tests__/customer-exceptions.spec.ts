import {
  InvalidEmailException,
  InvalidCreditException,
  InvalidPhoneException,
  CustomerNotFoundException,
  CustomerAlreadyExistsException,
  CreditNonZeroException,
} from '@/customer/domain';

describe('Customer Exceptions', () => {
  describe('InvalidEmailException', () => {
    it('should create exception with correct error message', () => {
      const email = 'invalid@email';
      const exception = new InvalidEmailException(email);

      expect(exception).toBeInstanceOf(InvalidEmailException);
      expect(exception.message).toBe(`Invalid email format: ${email}`);
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('InvalidCreditException', () => {
    it('should create exception with correct error message', () => {
      const reason = 'negative amount';
      const exception = new InvalidCreditException(reason);

      expect(exception).toBeInstanceOf(InvalidCreditException);
      expect(exception.message).toBe(`Invalid credit: ${reason}`);
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('InvalidPhoneException', () => {
    it('should create exception with correct error message', () => {
      const phone = '123456';
      const exception = new InvalidPhoneException(phone);

      expect(exception).toBeInstanceOf(InvalidPhoneException);
      expect(exception.message).toBe(`Invalid phone number: ${phone}`);
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('CustomerNotFoundException', () => {
    it('should create exception with correct error message', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const exception = new CustomerNotFoundException(id);

      expect(exception).toBeInstanceOf(CustomerNotFoundException);
      expect(exception.message).toBe(`Customer with id ${id} not found`);
      expect(exception.getStatus()).toBe(404);
    });
  });

  describe('CustomerAlreadyExistsException', () => {
    it('should create exception with correct error message', () => {
      const email = 'existing@email.com';
      const exception = new CustomerAlreadyExistsException(email);

      expect(exception).toBeInstanceOf(CustomerAlreadyExistsException);
      expect(exception.message).toBe(
        `Customer with email ${email} already exists`,
      );
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('CreditNonZeroException', () => {
    it('should create exception with correct error message', () => {
      const exception = new CreditNonZeroException();

      expect(exception).toBeInstanceOf(CreditNonZeroException);
      expect(exception.message).toBe('Credit must be greater than zero');
      expect(exception.getStatus()).toBe(400);
    });
  });

  describe('Exception inheritance', () => {
    it('should ensure all exceptions inherit from NestJS exceptions', () => {
      const exceptions = [
        new InvalidEmailException('test@email'),
        new InvalidCreditException('test reason'),
        new InvalidPhoneException('12345'),
        new CustomerNotFoundException('123'),
        new CustomerAlreadyExistsException('test@email'),
        new CreditNonZeroException(),
      ];

      exceptions.forEach((exception) => {
        expect(exception.getStatus).toBeDefined();
        expect(typeof exception.getStatus).toBe('function');
      });
    });
  });
});
