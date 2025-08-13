import { describe, it, expect } from 'vitest';
import { getNameFromAddress } from '../lib/names';
import { ClarityType } from '@stacks/transactions';
import { hex_to_ascii } from '../lib/string-utils';

describe('getNameFromAddress', () => {
  it('should resolve friedger.btc from mainnet address', async () => {
    // friedger.btc is owned by SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X
    const address = 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X';
    const result = await getNameFromAddress(address);

    // Should return a successful response
    expect(result.type).toBe(ClarityType.ResponseOk);
    expect(result.value.type).toBe(ClarityType.OptionalSome);
    if (result.type === ClarityType.ResponseOk && result.value.type === ClarityType.OptionalSome) {
      const { name, namespace } = result.value.value.value;

      // Convert hex-encoded values to ASCII
      const nameStr = hex_to_ascii(name.value);
      const namespaceStr = hex_to_ascii(namespace.value);

      // Should resolve to friedger.btc
      expect(nameStr).toBe('friedger');
      expect(namespaceStr).toBe('btc');

      console.log(`Resolved: ${nameStr}.${namespaceStr}`);
    } else {
      throw new Error(`Expected ResponseOk with Tuple, got ${result.type}`);
    }
  }, 10000); // Increase timeout for network call
});
