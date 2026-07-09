/**
 * Fixed en-US/UTC formatting so server-rendered and client-rendered dates
 * always match — `toLocaleDateString()` without arguments picks up the
 * runtime's locale/timezone, which differs between server and browser and
 * causes a React hydration mismatch.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(new Date(iso));
}
