import { describe, expect, it } from "vitest";
import { SearchKindTally } from "@app/feature/search/SearchKindTally";
import type { SearchItem } from "@app/feature/search/SearchItem";
import type { SearchItemKind } from "@app/feature/search/SearchItemKind";
import type { SearchResult } from "@app/feature/search/SearchResult";

const underTest: typeof SearchKindTally = SearchKindTally;

const result = (kind: SearchItemKind, title: string): SearchResult => ({
    item: {
        kind,
        title,
        description: "",
        href: `/${title}/`,
        keywords: [],
        meta: [],
        language: null,
    } satisfies SearchItem,
    refIndex: 0,
});

const FOUND: SearchResult[] = [
    result("software", "signale"),
    result("software", "taskbook"),
    result("publication", "an-article"),
];

describe("SearchKindTally.of", () => {
    it("givenResultsOfSeveralKinds_whenTallied_thenEachKindStatesItsCount", () => {
        expect(underTest.of(FOUND)).toEqual({
            software: 2,
            publication: 1,
            press: 0,
        });
    });

    it("givenNoResult_whenTallied_thenEveryKindIsZero", () => {
        expect(underTest.of([])).toEqual({
            software: 0,
            publication: 0,
            press: 0,
        });
    });
});

describe("SearchKindTally.only", () => {
    it("givenAKind_whenNarrowed_thenOnlyThatKindIsKept", () => {
        expect(underTest.only(FOUND, "software").map(({ item }: SearchResult) => item.title)).toEqual([
            "signale",
            "taskbook",
        ]);
    });

    it("givenNoKind_whenNarrowed_thenEveryResultIsKept", () => {
        expect(underTest.only(FOUND, null)).toHaveLength(3);
    });

    it("givenAKindThatMatchedNothing_whenNarrowed_thenTheListIsEmpty", () => {
        expect(underTest.only(FOUND, "press")).toEqual([]);
    });
});
