import { describe, expect, it } from "vitest";
import { FieldData } from "@app/feature/field/FieldData";
import { FieldDataParser } from "@ui/script/field/FieldDataParser";
import { FieldDataRecorder } from "@ui/script/field/FieldDataRecorder";
import { MonthVolume } from "@app/feature/field/MonthVolume";

describe("FieldData", () => {
    const fieldData: FieldData = new FieldData(
        [new MonthVolume("Jan 2018", 3_619), new MonthVolume("</script>", 2_452)],
        155_365
    );

    it("givenFieldData_whenRecordedAndParsed_thenTheSameFiguresReturn", () => {
        const parsed: FieldData = new FieldDataParser().parse(new FieldDataRecorder().record(fieldData));

        expect(parsed.getDependentRepositories()).toBe(155_365);
        expect(parsed.getMonthVolumes()[0].getLabel()).toBe("Jan 2018");
        expect(parsed.getMonthVolumes()[0].getDownloads()).toBe(3_619);
        expect(parsed.getMonthVolumes()[1].getLabel()).toBe("</script>");
        expect(parsed.getMonthVolumes()[1].getDownloads()).toBe(2_452);
    });

    it("givenAnAngleBracket_whenRecorded_thenTheRecordCannotCloseTheScript", () => {
        expect(new FieldDataRecorder().record(fieldData)).not.toContain("<");
    });
});
