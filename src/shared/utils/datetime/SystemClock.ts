/** The one place the current time is read, keeping the rest deterministic. */
export class SystemClock {
  public static currentYear(): number {
    return new Date().getFullYear();
  }
}
