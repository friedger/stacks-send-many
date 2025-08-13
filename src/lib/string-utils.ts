/**
 * Convert hex string to ASCII string
 * @param hexString - hex encoded string (e.g., "68656c6c6f" for "hello")
 * @returns ASCII string
 */
export function hex_to_ascii(hexString: string): string {
  let result = '';
  for (let i = 0; i < hexString.length; i += 2) {
    const hexByte = hexString.substring(i, i + 2);
    result += String.fromCharCode(parseInt(hexByte, 16));
  }
  return result;
}
