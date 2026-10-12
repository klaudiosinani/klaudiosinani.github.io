import type { MonthVolumeRecord } from "./MonthVolumeRecord";

export interface FieldDataRecord {
    months: MonthVolumeRecord[];
    dependentRepositories: number;
}
