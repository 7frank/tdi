/**
 *
 * @param s remove special characters so that key in di container does match
 * @returns
 */
export function sanitize(s: string) {
  return s.replace(/[^\w\s]/gi, "_");
}
