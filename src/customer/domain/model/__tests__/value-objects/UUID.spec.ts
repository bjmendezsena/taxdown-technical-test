import { UUID } from '../../value-objects/UUID';

describe('UUID', () => {
  describe('create', () => {
    it('should create a new UUID with a random value when no id is provided', () => {
      const uuid = UUID.create();
      expect(UUID.isValid(uuid.getValue())).toBe(true);
    });

    it('should create a UUID with the provided id', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = UUID.create(id);
      expect(uuid.getValue()).toBe(id);
    });
  });

  describe('createFromList', () => {
    it('should create an array of UUIDs from a list of strings', () => {
      const ids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '987fcdeb-51a2-43d7-9012-345678901234',
      ];
      const uuids = UUID.createFromList(ids);
      expect(uuids).toHaveLength(2);
      expect(uuids[0].getValue()).toBe(ids[0]);
      expect(uuids[1].getValue()).toBe(ids[1]);
    });
  });

  describe('isValid', () => {
    it('should return true for valid v4 UUID', () => {
      const validId = '123e4567-e89b-42d3-a456-426614174000';
      expect(UUID.isValid(validId)).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      const invalidId = 'not-a-uuid';
      expect(UUID.isValid(invalidId)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true when comparing same UUIDs', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const uuid1 = UUID.create(id);
      const uuid2 = UUID.create(id);
      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should return true when comparing with string representation', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = UUID.create(id);
      expect(uuid.equals(id)).toBe(true);
    });

    it('should return false when comparing different UUIDs', () => {
      const uuid1 = UUID.create('123e4567-e89b-12d3-a456-426614174000');
      const uuid2 = UUID.create('987fcdeb-51a2-43d7-9012-345678901234');
      expect(uuid1.equals(uuid2)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty UUID', () => {
      const uuid = new UUID('');
      expect(uuid.isEmpty()).toBe(true);
    });

    it('should return false for non-empty UUID', () => {
      const uuid = UUID.create();
      expect(uuid.isEmpty()).toBe(false);
    });
  });
});
