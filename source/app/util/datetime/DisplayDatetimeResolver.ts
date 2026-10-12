import type { DatetimeValue } from "./DatetimeValue";

export class DisplayDatetimeResolver {
    public resolve(pubDatetime: DatetimeValue, modDatetime: DatetimeValue | null | undefined): DatetimeValue {
        return this.isUpdated(pubDatetime, modDatetime) && modDatetime != null ? modDatetime : pubDatetime;
    }

    public isUpdated(pubDatetime: DatetimeValue, modDatetime: DatetimeValue | null | undefined): boolean {
        return (
            modDatetime !== null &&
            modDatetime !== undefined &&
            new Date(modDatetime).getTime() > new Date(pubDatetime).getTime()
        );
    }
}
