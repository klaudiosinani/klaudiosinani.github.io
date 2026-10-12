import { describe, expect, it } from "vitest";
import { SearchHighlightFactory } from "@app/feature/search/factory/SearchHighlightFactory";
import type { SearchMatch } from "@app/feature/search/SearchResult";
import type { SearchSegment } from "@app/feature/search/SearchSegment";

const underTest: typeof SearchHighlightFactory = SearchHighlightFactory;

const marked = (segments: readonly SearchSegment[]): string[] =>
    segments.filter(({ matched }: SearchSegment) => matched).map(({ text }: SearchSegment) => text);

const whole = (segments: readonly SearchSegment[]): string => segments.map(({ text }: SearchSegment) => text).join("");

describe("SearchHighlightFactory.create", () => {
    it("givenAMatchInTheName_whenCut_thenTheLettersFoundAreMarked", () => {
        const matches: SearchMatch[] = [{ key: "title", indices: [[0, 5]] }];

        const segments: SearchSegment[] = underTest.create("Signale", matches);

        expect(marked(segments)).toEqual(["Signal"]);
        expect(whole(segments)).toBe("Signale");
    });

    it("givenRunsThatFollowOneAnother_whenCut_thenTheyReadAsOneMark", () => {
        const matches: SearchMatch[] = [
            {
                key: "title",
                indices: [
                    [0, 0],
                    [1, 1],
                    [2, 2],
                ],
            },
        ];

        expect(marked(underTest.create("Signale", matches))).toEqual(["Sig"]);
    });

    it("givenTwoRunsApart_whenCut_thenEachIsMarkedOnItsOwn", () => {
        const segments: SearchSegment[] = underTest.create("Taskbook notes", [
            {
                key: "title",
                indices: [
                    [0, 3],
                    [9, 13],
                ],
            },
        ]);

        expect(marked(segments)).toEqual(["Task", "notes"]);
        expect(whole(segments)).toBe("Taskbook notes");
    });

    it("givenRunsOutOfOrder_whenCut_thenTheNameIsStillWhole", () => {
        const segments: SearchSegment[] = underTest.create("Taskbook notes", [
            {
                key: "title",
                indices: [
                    [9, 13],
                    [0, 3],
                ],
            },
        ]);

        expect(marked(segments)).toEqual(["Task", "notes"]);
        expect(whole(segments)).toBe("Taskbook notes");
    });

    it("givenAMatchInAnotherField_whenCut_thenTheNameIsLeftPlain", () => {
        const matches: SearchMatch[] = [{ key: "description", indices: [[0, 5]] }];

        expect(marked(underTest.create("Signale", matches))).toEqual([]);
        expect(underTest.create("Signale", matches)).toHaveLength(1);
    });

    it("givenNoMatchAtAll_whenCut_thenTheNameIsOneUnmarkedRun", () => {
        expect(underTest.create("Signale")).toEqual([{ text: "Signale", matched: false }]);
    });

    it("givenTheWholeNameMatched_whenCut_thenNothingStandsAroundTheMark", () => {
        expect(underTest.create("Ao", [{ key: "title", indices: [[0, 1]] }])).toEqual([{ text: "Ao", matched: true }]);
    });
});
