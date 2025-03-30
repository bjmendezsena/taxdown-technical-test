/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Customer,
  CustomerCreatedEvent,
  UpdateCustomerEvent,
  CreditAddedEvent,
  DeleteCustomerEvent,
  CreditNonZeroException,
  UUID,
} from '@/customer/domain';
import { fixedDate, fixedUUID } from '@/test/setup';

beforeAll(() => {
  jest.spyOn(UUID, 'create').mockImplementation(() => {
    return new UUID(fixedUUID);
  });
});

describe('Customer Entity', () => {
  const validCustomerData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    credit: 100,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };

  describe('creation', () => {
    it('should create a customer with all fields', () => {
      const customer = Customer.create(validCustomerData);
      const customerJson = customer.toJson();
      expect(customerJson).toEqual(
        expect.objectContaining({
          id: validCustomerData.id,
          firstName: validCustomerData.firstName,
          lastName: validCustomerData.lastName,
          email: validCustomerData.email,
          phone: validCustomerData.phone,
          credit: validCustomerData.credit,
        }),
      );
    });

    it('should create a customer without optional fields', () => {
      const { phone, credit, createdAt, updatedAt, ...requiredData } =
        validCustomerData;
      const customer = Customer.create(requiredData);
      const customerJson = customer.toJson();
      expect(customerJson).toEqual(
        expect.objectContaining({
          id: requiredData.id,
          firstName: requiredData.firstName,
          lastName: requiredData.lastName,
          email: requiredData.email,
          credit: 0,
        }),
      );
    });

    it('should record CustomerCreatedEvent on creation', () => {
      const customer = Customer.create(validCustomerData);
      const events = customer.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CustomerCreatedEvent);
      expect(events[0]).toEqual(
        expect.objectContaining({
          customerId: validCustomerData.id,
          firstName: validCustomerData.firstName,
          lastName: validCustomerData.lastName,
          email: validCustomerData.email,
          phone: validCustomerData.phone,
          aggregateId: fixedUUID,
          occurredAt: fixedDate,
        }),
      );
    });
  });

  describe('reconstitution', () => {
    it('should reconstitute a customer with credit in cents', () => {
      const customerWithCents = { ...validCustomerData, credit: 10000 };
      const customer = Customer.reconstitute(customerWithCents);
      expect(customer.getAvailableCredit()).toBe(100);
    });
  });

  describe('update operations', () => {
    it('should update customer data', () => {
      const customer = Customer.create(validCustomerData);
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        credit: 200,
      };
      const updatedCustomer = customer.update(updateData);
      const customerJson = updatedCustomer.toJson();
      expect(customerJson).toEqual(
        expect.objectContaining({
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          phone: updateData.phone,
          credit: updateData.credit,
        }),
      );
    });

    it('should record UpdateCustomerEvent on update', () => {
      const customer = Customer.create(validCustomerData);
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        credit: 200,
      };
      const updatedCustomer = customer.update(updateData);
      const events = updatedCustomer.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UpdateCustomerEvent);
    });
  });

  describe('credit operations', () => {
    it('should add credit and record CreditAddedEvent', () => {
      const customer = Customer.create(validCustomerData);
      const additionalCredit = 50;
      customer.addCredit(additionalCredit);
      const events = customer.pullEvents();
      expect(customer.getAvailableCredit()).toBe(
        validCustomerData.credit + additionalCredit,
      );
      expect(events).toHaveLength(2); // Created + Credit Added
      expect(events[1]).toBeInstanceOf(CreditAddedEvent);
    });

    it('should validate positive credit', () => {
      const customerWithNoCredit = Customer.create({
        ...validCustomerData,
        credit: 0,
      });
      expect(() => customerWithNoCredit.validateCredit()).not.toThrow();
      expect(customerWithNoCredit.hasCredit()).toBe(true);
    });

    it('should throw CreditNonZeroException for negative credit', () => {
      const customerWithNegativeCredit = Customer.create({
        ...validCustomerData,
        credit: -100,
      });
      expect(() => customerWithNegativeCredit.validateCredit()).toThrow(
        CreditNonZeroException,
      );
      expect(customerWithNegativeCredit.hasCredit()).toBe(false);
    });
  });

  describe('data access', () => {
    const customer = Customer.create(validCustomerData);

    it('should return full name', () => {
      expect(customer.getFullName()).toBe(
        `${validCustomerData.firstName} ${validCustomerData.lastName}`,
      );
    });

    it('should return email', () => {
      expect(customer.getEmail()).toBe(validCustomerData.email);
    });

    it('should return phone', () => {
      expect(customer.getPhone()).toBe(validCustomerData.phone);
    });

    it('should return null when phone is not provided', () => {
      const customerWithoutPhone = Customer.create({
        ...validCustomerData,
        phone: undefined,
      });
      expect(customerWithoutPhone.getPhone()).toBeNull();
    });
  });

  describe('event handling', () => {
    it('should record and pull events', () => {
      const customer = Customer.create(validCustomerData);
      customer.delete();
      const events = customer.pullEvents();
      expect(events).toHaveLength(2); // Created + Deleted
      expect(events[1]).toBeInstanceOf(DeleteCustomerEvent);
      const subsequentEvents = customer.pullEvents();
      expect(subsequentEvents).toHaveLength(0);
    });
  });

  describe('JSON serialization', () => {
    const customer = Customer.create(validCustomerData);

    it('should serialize to JSON with regular credit', () => {
      const json = customer.toJson();
      expect(json.credit).toBe(validCustomerData.credit);
    });

    it('should serialize to raw JSON with credit in cents', () => {
      const json = customer.toRawJson();
      expect(json.credit).toBe(validCustomerData.credit * 100);
    });
  });
});
