import type { FieldDataRecord } from "./record/FieldDataRecord";
import type { MonthVolumeRecord } from "./record/MonthVolumeRecord";
import { FieldData } from "@app/feature/field/FieldData";
import { MonthVolume } from "@app/feature/field/MonthVolume";

export class FieldDataParser {
    public parse(text: string): FieldData {
        const fieldDataRecord: FieldDataRecord = JSON.parse(text) as FieldDataRecord;

        return new FieldData(
            fieldDataRecord.months.map(
                (monthVolumeRecord: MonthVolumeRecord) =>
                    new MonthVolume(monthVolumeRecord.label, monthVolumeRecord.downloads)
            ),
            fieldDataRecord.dependentRepositories
        );
    }
}
