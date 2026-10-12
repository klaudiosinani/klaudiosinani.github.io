import type { DatetimeValue } from "@app/util/datetime/DatetimeValue";

export interface PublicationDates {
    readonly pubDatetime: DatetimeValue;
    readonly modDatetime: DatetimeValue | undefined | null;
}
