import { describe, expect, it } from "vitest";
import { ChartReadings } from "@app/util/chart/ChartReadings";

const underTest: ChartReadings = new ChartReadings(5);

describe("ChartReadings", () => {
    it("givenAPlaceAcrossTheFrame_whenAsked_thenTheNearestReadingIsFound", () => {
        expect(underTest.at(0)).toBe(0);
        expect(underTest.at(0.5)).toBe(2);
        expect(underTest.at(1)).toBe(4);
    });

    it("givenAPlaceBetweenTwoReadings_whenAsked_thenTheNearerOneIsFound", () => {
        expect(underTest.at(0.3)).toBe(1);
        expect(underTest.at(0.4)).toBe(2);
    });

    it("givenAPlaceOutsideTheFrame_whenAsked_thenTheReadingIsStillOneOfTheList", () => {
        expect(underTest.at(-2)).toBe(0);
        expect(underTest.at(3)).toBe(4);
    });

    it("givenAStepPastTheEnd_whenClamped_thenItStandsAtTheEnd", () => {
        expect(underTest.clamp(-1)).toBe(0);
        expect(underTest.clamp(99)).toBe(4);
    });

    it("givenAReading_whenAskedWhereItStands_thenItIsAFractionOfTheWidth", () => {
        expect(underTest.across(0)).toBe(0);
        expect(underTest.across(2)).toBe(0.5);
        expect(underTest.across(4)).toBe(1);
    });

    it("givenOneReadingAlone_whenAskedWhereItStands_thenItStandsAtTheStart", () => {
        expect(new ChartReadings(1).across(0)).toBe(0);
    });

    it("givenNoReadings_whenAsked_thenItSaysThatItIsEmpty", () => {
        expect(new ChartReadings(0).empty).toBe(true);
        expect(underTest.empty).toBe(false);
    });

    it("givenReadings_whenAskedForTheLast_thenItIsOneLessThanTheirNumber", () => {
        expect(underTest.last).toBe(4);
    });
});
