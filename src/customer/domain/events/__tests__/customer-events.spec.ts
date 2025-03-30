import {
  CustomerCreatedEvent,
  UpdateCustomerEvent,
  DeleteCustomerEvent,
  CreditAddedEvent,
  UUID,
} from '@/customer/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

beforeAll(() => {
  jest.spyOn(UUID, 'create').mockImplementation(() => {
    return new UUID(fixedUUID);
  });
});

describe('Domain Events', () => {
  const customerData = {
    customerId: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  };

  describe('CustomerCreatedEvent', () => {
    it('should create event with all required properties', () => {
      const event = new CustomerCreatedEvent(
        customerData.customerId,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.phone,
      );

      expect(event).toEqual({
        customerId: customerData.customerId,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        occurredAt: fixedDate,
        aggregateId: fixedUUID,
      });
    });

    it('should handle null phone number', () => {
      const event = new CustomerCreatedEvent(
        customerData.customerId,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        null,
      );

      expect(event.phone).toBeNull();
    });
  });

  describe('UpdateCustomerEvent', () => {
    it('should create event with all properties', () => {
      const event = new UpdateCustomerEvent(
        customerData.customerId,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.phone,
      );

      expect(event).toEqual({
        customerId: customerData.customerId,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        occurredAt: fixedDate,
        aggregateId: fixedUUID,
      });
    });

    it('should handle null phone number in update', () => {
      const event = new UpdateCustomerEvent(
        customerData.customerId,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        null,
      );

      expect(event.phone).toBeNull();
    });
  });

  describe('DeleteCustomerEvent', () => {
    it('should create event with required properties', () => {
      const event = new DeleteCustomerEvent(customerData.customerId);

      expect(event).toEqual({
        customerId: customerData.customerId,
        occurredAt: fixedDate,
        aggregateId: fixedUUID,
      });
    });
  });

  describe('CreditAddedEvent', () => {
    it('should create event with credit information', () => {
      const amount = 100;
      const newTotalCredit = 500;

      const event = new CreditAddedEvent(
        customerData.customerId,
        amount,
        newTotalCredit,
      );

      expect(event).toEqual({
        customerId: customerData.customerId,
        amount: amount,
        newTotalCredit: newTotalCredit,
        occurredAt: fixedDate,
        aggregateId: fixedUUID,
      });
    });

    it('should handle decimal amounts', () => {
      const amount = 100.5;
      const newTotalCredit = 500.75;

      const event = new CreditAddedEvent(
        customerData.customerId,
        amount,
        newTotalCredit,
      );

      expect(event.amount).toBe(amount);
      expect(event.newTotalCredit).toBe(newTotalCredit);
    });
  });

  describe('Common event properties', () => {
    it('should ensure all events implement DomainEvent interface', () => {
      const events = [
        new CustomerCreatedEvent(
          customerData.customerId,
          customerData.firstName,
          customerData.lastName,
          customerData.email,
          customerData.phone,
        ),
        new UpdateCustomerEvent(
          customerData.customerId,
          customerData.firstName,
          customerData.lastName,
          customerData.email,
          customerData.phone,
        ),
        new DeleteCustomerEvent(customerData.customerId),
        new CreditAddedEvent(customerData.customerId, 100, 500),
      ];

      events.forEach((event) => {
        expect(event).toHaveProperty('occurredAt');
        expect(event).toHaveProperty('aggregateId');
        expect(event.occurredAt).toEqual(fixedDate);
        expect(event.aggregateId).toBe(fixedUUID);
      });
    });
  });
});
