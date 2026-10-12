import { describe, expect, it } from "vitest";
import type { SearchItem } from "@app/feature/search/SearchItem";
import { SearchSubjectsFactory } from "@app/feature/search/factory/SearchSubjectsFactory";

const underTest: typeof SearchSubjectsFactory = SearchSubjectsFactory;

const item = (keywords: string[]): SearchItem => ({
    kind: "software",
    title: "a",
    description: "",
    href: "/a/",
    keywords,
    meta: [],
    language: null,
});

describe("SearchSubjectsFactory.create", () => {
    it("givenTheIndex_whenRead_thenTheMostHeldSubjectsComeFirst", () => {
        const items: SearchItem[] = [item(["JavaScript", "cli"]), item(["JavaScript", "cli"]), item(["JavaScript"])];

        expect(underTest.create(items)).toEqual(["JavaScript", "cli"]);
    });

    it("givenASubjectHeldByOneThing_whenRead_thenItIsNotOffered", () => {
        expect(underTest.create([item(["JavaScript"]), item(["python"])])).toEqual([]);
    });

    it("givenTwoSubjectsHeldEqually_whenRead_thenTheyAreOrderedByName", () => {
        const items: SearchItem[] = [item(["zig", "ada"]), item(["zig", "ada"])];

        expect(underTest.create(items)).toEqual(["ada", "zig"]);
    });

    it("givenMoreSubjectsThanFit_whenRead_thenOnlyTheFirstAreOffered", () => {
        const many: string[] = ["a", "b", "c", "d"];
        const items: SearchItem[] = [item(many), item(many)];

        expect(underTest.create(items, 2)).toEqual(["a", "b"]);
    });

    it("givenNothingIndexed_whenRead_thenNoSubjectIsOffered", () => {
        expect(underTest.create([])).toEqual([]);
    });
});
