import type { DatetimeValue } from "@utils/datetime/DatetimeValue";

export interface PublicationDates {
  readonly pubDatetime: DatetimeValue;
  readonly modDatetime: DatetimeValue | undefined | null;
}
