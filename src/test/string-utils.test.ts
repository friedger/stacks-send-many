import { describe, it, expect } from 'vitest';
import { hex_to_ascii } from '../lib/string-utils';

describe('hex_to_ascii', () => {
  it('should convert simple ASCII characters correctly', () => {
    // Test basic ASCII characters: 65=e, 66=f, 67=g
    const input = '656667';
    const result = hex_to_ascii(input);
    expect(result).toBe('efg');
  });

  it('should handle empty string', () => {
    const result = hex_to_ascii('');
    expect(result).toBe('');
  });

  it('should convert single character', () => {
    // 65 = 'e' in ASCII
    const input = '65';
    const result = hex_to_ascii(input);
    expect(result).toBe('e');
  });

  it('should handle numeric characters', () => {
    // "12345" in hex: 31,32,33,34,35
    const input = '3132333435';
    const result = hex_to_ascii(input);
    expect(result).toBe('12345');
  });

  it('should handle special characters', () => {
    // "!@#$%" in hex: 21,40,23,24,25
    const input = '2140232425';
    const result = hex_to_ascii(input);
    expect(result).toBe('!@#$%');
  });

  it('should handle mixed alphanumeric with special chars', () => {
    // "test123!" in hex: 74,65,73,74,31,32,33,21
    const input = '7465737431323321';
    const result = hex_to_ascii(input);
    expect(result).toBe('test123!');
  });

  it('should handle domain-like strings', () => {
    // "friedger" in hex: 66,72,69,65,64,67,65,72
    const input = '6672696564676572';
    const result = hex_to_ascii(input);
    expect(result).toBe('friedger');
  });

  it('should handle dots and hyphens', () => {
    // "my-name" in hex: 6d,79,2d,6e,61,6d,65
    const input = '6d792d6e616d65';
    const result = hex_to_ascii(input);
    expect(result).toBe('my-name');
  });
});
