import { describe, expect, it } from "vitest";
import type { PublisherMark } from "@app/feature/press/PublisherMark";
import { PublisherMarksFactory } from "@app/feature/press/factory/PublisherMarksFactory";

const underTest: typeof PublisherMarksFactory = PublisherMarksFactory;

describe("PublisherMarksFactory", () => {
    it("givenOnePublisherThatWroteTwice_whenCreated_thenItStandsOnce", () => {
        const entries: { name: string; mark: string | null }[] = [
            { name: "Linux Magazine", mark: "/press/linux-magazine.png" },
            { name: "Linux Magazine", mark: "/press/linux-magazine.png" },
        ];

        const marks: readonly PublisherMark[] = underTest.create(entries);

        expect(marks).toEqual([{ name: "Linux Magazine", mark: "/press/linux-magazine.png" }]);
    });

    it("givenAPublisherWithNoMark_whenCreated_thenItIsLeftOut", () => {
        const entries: { name: string; mark: string | null }[] = [
            { name: "Better Stack", mark: null },
            { name: "OMG Ubuntu", mark: "/press/omgubuntu.png" },
        ];

        const marks: readonly PublisherMark[] = underTest.create(entries);

        expect(marks.map(({ name }: PublisherMark) => name)).toEqual(["OMG Ubuntu"]);
    });

    it("givenSeveralPublishers_whenCreated_thenTheOrderIsKept", () => {
        const entries: { name: string; mark: string | null }[] = [
            { name: "OMG Ubuntu", mark: "/press/omgubuntu.png" },
            { name: "Better Stack", mark: "/press/betterstack.png" },
        ];

        const marks: readonly PublisherMark[] = underTest.create(entries);

        expect(marks.map(({ name }: PublisherMark) => name)).toEqual(["OMG Ubuntu", "Better Stack"]);
    });

    it("givenNoEntry_whenCreated_thenTheRowIsEmpty", () => {
        expect(underTest.create([])).toEqual([]);
    });
});
