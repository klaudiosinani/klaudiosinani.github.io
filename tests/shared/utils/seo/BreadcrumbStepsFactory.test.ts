import { describe, expect, it } from "vitest";
import type { BreadcrumbStep } from "@app/util/seo/BreadcrumbListSchemaBuilder";
import { BreadcrumbStepsFactory } from "@app/util/seo/BreadcrumbStepsFactory";
import type { TrailStep } from "@app/util/routing/TrailStep";

const underTest: typeof BreadcrumbStepsFactory = BreadcrumbStepsFactory;

const TRAIL: TrailStep[] = [
    { name: "Software", href: "/software/" },
    { name: "Signale.js", href: "/signale/" },
];

describe("BreadcrumbStepsFactory.create", () => {
    it("givenATrail_whenWrittenForASearchEngine_thenTheHomePageIsNamedFirst", () => {
        const steps: BreadcrumbStep[] = underTest.create(TRAIL, "Home", "https://klaudiosinani.com/");

        expect(steps[0]).toEqual({
            name: "Home",
            url: "https://klaudiosinani.com/",
        });
    });

    it("givenATrail_whenWrittenForASearchEngine_thenEveryStepStatesAFullAddress", () => {
        const steps: BreadcrumbStep[] = underTest.create(TRAIL, "Home", "https://klaudiosinani.com/");

        for (const { url } of steps) {
            expect(url).toMatch(/^https:\/\/klaudiosinani\.com\//);
        }
    });

    it("givenATrail_whenWrittenForASearchEngine_thenTheOrderIsKept", () => {
        expect(
            underTest.create(TRAIL, "Home", "https://klaudiosinani.com/").map(({ name }: BreadcrumbStep) => name)
        ).toEqual(["Home", "Software", "Signale.js"]);
    });

    it("givenNoStepBelowTheHomePage_whenWritten_thenTheHomePageStandsAlone", () => {
        expect(underTest.create([], "Home", "https://klaudiosinani.com/")).toHaveLength(1);
    });
});
