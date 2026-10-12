import { describe, expect, it } from "vitest";
import { BREADCRUMB_SEPARATOR } from "@app/configuration/BreadcrumbSeparator";

const underTest: string = BREADCRUMB_SEPARATOR;

describe("BREADCRUMB_SEPARATOR", () => {
    it("givenTheMarkBetweenTwoSteps_whenRead_thenItIsTheOneAPathIsWrittenWith", () => {
        expect(underTest).toBe("/");
    });

    it("givenTheMarkBetweenTwoSteps_whenCompared_thenItIsNotTheMarkBetweenTwoFacts", () => {
        expect(underTest).not.toBe("·");
    });

    it("givenTheMarkBetweenTwoSteps_whenMeasured_thenItIsOneCharacterOfTheGrid", () => {
        expect(underTest).toHaveLength(1);
    });
});
