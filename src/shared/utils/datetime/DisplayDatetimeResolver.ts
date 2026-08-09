import type { DatetimeValue } from "./DatetimeValue";

export class DisplayDatetimeResolver {
  public static resolve(
    pubDatetime: DatetimeValue,
    modDatetime: DatetimeValue | null | undefined
  ): DatetimeValue {
    return DisplayDatetimeResolver.isUpdated(pubDatetime, modDatetime) &&
      modDatetime != null
      ? modDatetime
      : pubDatetime;
  }

  public static isUpdated(
    pubDatetime: DatetimeValue,
    modDatetime: DatetimeValue | null | undefined
  ): boolean {
    return (
      modDatetime !== null &&
      modDatetime !== undefined &&
      new Date(modDatetime).getTime() > new Date(pubDatetime).getTime()
    );
  }
}
