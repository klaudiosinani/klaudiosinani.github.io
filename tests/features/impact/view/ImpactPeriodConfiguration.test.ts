import { describe, expect, it } from "vitest";
import { ImpactPeriodConfiguration } from "@ui/feature/impact/component/ImpactPeriodConfiguration";
import { ReportingPeriods } from "@app/util/period/ReportingPeriods";

const underTest: typeof ImpactPeriodConfiguration = ImpactPeriodConfiguration;

describe("ImpactPeriodConfiguration.DEFAULT", () => {
    it("givenTheFirstView_whenSelectingTheWindow_thenItIsOneOfTheWindowsOnOffer", () => {
        expect(ReportingPeriods.ALL).toContain(underTest.DEFAULT);
    });
});

describe("ImpactPeriodConfiguration.LABELS", () => {
    it("givenTheButtons_whenLabelled_thenEveryWindowHasAName", () => {
        for (const period of ReportingPeriods.ALL) {
            expect(underTest.LABELS[period].length).toBeGreaterThan(0);
        }
    });

    it("givenTheButtons_whenLabelled_thenNoTwoWindowsShareAName", () => {
        const names: string[] = ReportingPeriods.ALL.map(
            (period: "month" | "quarter" | "year" | "all") => underTest.LABELS[period]
        );

        expect(new Set(names).size).toBe(names.length);
    });
});
