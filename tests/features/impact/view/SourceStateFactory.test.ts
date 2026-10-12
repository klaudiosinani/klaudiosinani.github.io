import { describe, expect, it } from "vitest";
import type { ImpactData } from "@app/feature/impact/ImpactData";
import type { SourceState } from "@ui/feature/impact/component/SourceState";
import { SourceStateFactory } from "@ui/feature/impact/component/SourceStateFactory";

const underTest: typeof SourceStateFactory = SourceStateFactory;

const impact = (overrides: Partial<ImpactData> = {}): ImpactData =>
    ({
        outlets: [
            { outlet: "npm", month: 1, quarter: 1, year: 1, all: 1 },
            { outlet: "pypi", month: null, quarter: null, year: null, all: null },
        ],
        traffic: null,
        installedBase: null,
        ...overrides,
    }) as ImpactData;

describe("SourceStateFactory.create", () => {
    it("givenASourceThatAnswered_whenReading_thenItIsStatedAsAnswered", () => {
        const states: SourceState[] = underTest.create(impact());

        expect(states[0]).toEqual({
            name: "npm",
            answered: true,
            absent: "the downloads it counts",
        });
    });

    it("givenASourceThatWasSilent_whenReading_thenTheLossIsNamed", () => {
        expect(underTest.create(impact())[1]).toEqual({
            name: "PyPI",
            answered: false,
            absent: "the downloads it counts",
        });
    });

    it("givenNoTrafficAndNoSnapFigure_whenReading_thenBothAreStatedAsSilent", () => {
        const states: SourceState[] = underTest.create(impact());

        expect(states.filter(({ answered }: SourceState) => !answered).length).toBe(3);
    });

    it("givenEverySourceAnswered_whenReading_thenNoneIsSilent", () => {
        expect(
            underTest
                .create(
                    impact({
                        traffic: { clones: 1, views: 1 } as ImpactData["traffic"],
                        installedBase: 10,
                        outlets: [{ outlet: "npm", month: 1, quarter: 1, year: 1, all: 1 }],
                    })
                )
                .every(({ answered }: SourceState) => answered)
        ).toBe(true);
    });
});
