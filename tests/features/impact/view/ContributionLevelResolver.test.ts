import { describe, expect, it } from "vitest";
import { ContributionLevelResolver } from "@ui/feature/impact/component/ContributionLevelResolver";

const underTest: typeof ContributionLevelResolver = ContributionLevelResolver;

describe("ContributionLevelResolver.resolve", () => {
    it("givenADayWithNoWork_whenReading_thenTheSquareIsEmpty", () => {
        expect(underTest.resolve(0)).toBe(0);
    });

    it("givenADayWithWork_whenReading_thenTheSquareIsNotEmpty", () => {
        expect(underTest.resolve(1)).toBe(1);
    });

    it("givenMoreWork_whenReading_thenTheSquareIsDarker", () => {
        expect(underTest.resolve(4)).toBe(2);
        expect(underTest.resolve(8)).toBe(3);
        expect(underTest.resolve(40)).toBe(4);
    });

    it("givenACountBelowZero_whenReading_thenTheSquareIsEmpty", () => {
        expect(underTest.resolve(-1)).toBe(0);
    });
});
