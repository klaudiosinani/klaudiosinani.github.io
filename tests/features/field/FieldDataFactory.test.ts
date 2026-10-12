import { describe, expect, it } from "vitest";
import type { FieldData } from "@app/feature/field/FieldData";
import { FieldDataFactory } from "@app/feature/field/FieldDataFactory";
import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import { MonthSeriesLabeler } from "@app/util/datetime/MonthSeriesLabeler";
import type { MonthVolume } from "@app/feature/field/MonthVolume";

describe("FieldDataFactory", () => {
    const fieldDataFactory: FieldDataFactory = new FieldDataFactory(new MonthSeriesLabeler());
    const impactDataOf = (all: number[]): ImpactData =>
        ({ getDownloadTrend: () => ({ month: [], quarter: [], year: [], all }) }) as unknown as ImpactData;

    it("givenSmallEarlyMonths_whenCreating_thenTheSeriesStartsAtTheFirstMonthOfAHundredThousand", () => {
        const fieldData: FieldData = fieldDataFactory.create(
            impactDataOf([3_619, 2_452, 99_999, 145_000, 98_000, 13_916_365]),
            155_365,
            2018
        );

        expect(fieldData.getMonthVolumes().map((monthVolume: MonthVolume) => monthVolume.getLabel())).toEqual([
            "Apr 2018",
            "May 2018",
            "Jun 2018",
        ]);
        expect(fieldData.getDependentRepositories()).toBe(155_365);
    });

    it("givenNoMonthOfAHundredThousand_whenCreating_thenNoMonthIsShown", () => {
        expect(fieldDataFactory.create(impactDataOf([3_619, 2_452]), 0, 2018).getMonthVolumes()).toEqual([]);
    });
});
