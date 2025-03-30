const fixedDate = new Date('2023-01-01T00:00:00.000Z');
const fixedUUID = '123e4567-e89b-12d3-a456-426614174000';

beforeAll(() => {
  // Mock Date
  jest.useFakeTimers();
  jest.setSystemTime(fixedDate);
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

export { fixedDate, fixedUUID };
