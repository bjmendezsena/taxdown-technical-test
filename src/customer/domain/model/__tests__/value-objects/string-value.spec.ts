import { StringValue } from '@/customer/domain';

describe('StringValue', () => {
  it('should create an empty StringValue by default', () => {
    const str = new StringValue();
    expect(str.getValue()).toBe('');
    expect(str.isEmpty()).toBe(true);
  });

  it('should create a StringValue with a given string', () => {
    const strTest = 'test';
    const str = new StringValue(strTest);
    expect(str.getValue()).toBe(strTest);
    expect(str.isEmpty()).toBe(false);
  });

  it('should return true when comparing two equal StringValue instances', () => {
    const strValue = 'hello';

    const str1 = new StringValue(strValue);
    const str2 = new StringValue(strValue);

    expect(str1.equals(str2)).toBe(true);
  });

  it('should return false when comparing two different StringValue instances', () => {
    const str1 = new StringValue('hello');
    const str2 = new StringValue('world');
    expect(str1.equals(str2)).toBe(false);
  });

  it('should return true when comparing with an equal string literal', () => {
    const str = new StringValue('test');
    expect(str.equals('test')).toBe(true);
  });

  it('should return false when comparing with a different string literal', () => {
    const str = new StringValue('test');
    expect(str.equals('other')).toBe(false);
  });

  it('should create StringValue using static create()', () => {
    const str = StringValue.create('static');
    expect(str.getValue()).toBe('static');
  });

  it('should be considered empty when created with an empty string', () => {
    const str = StringValue.create('');
    expect(str.isEmpty()).toBe(true);
  });
});
