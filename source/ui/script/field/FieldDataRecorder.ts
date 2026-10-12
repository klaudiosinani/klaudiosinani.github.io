import type { FieldData } from "@app/feature/field/FieldData";
import type { FieldDataRecord } from "./record/FieldDataRecord";
import type { MonthVolume } from "@app/feature/field/MonthVolume";

export class FieldDataRecorder {
    private readonly UNSAFE: RegExp = /</g;
    private readonly SAFE: string = "\\u003c";

    public record(fieldData: FieldData): string {
        const fieldDataRecord: FieldDataRecord = {
            months: fieldData.getMonthVolumes().map((monthVolume: MonthVolume) => ({
                label: monthVolume.getLabel(),
                downloads: monthVolume.getDownloads(),
            })),
            dependentRepositories: fieldData.getDependentRepositories(),
        };

        return JSON.stringify(fieldDataRecord).replace(this.UNSAFE, this.SAFE);
    }
}
