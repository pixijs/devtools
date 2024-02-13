/**
 * Check if two values are different
 * @param a - First value
 * @param b - Second value
 * @returns True if the values are different, false otherwise
 */
export function checkDiff(a: any | string, b: any | string) {
  const convertedA = a instanceof String ? a : JSON.stringify(a);
  const convertedB = b instanceof String ? b : JSON.stringify(b);

  return convertedA === convertedB;
}
