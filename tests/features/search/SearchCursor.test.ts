import { describe, expect, it } from "vitest";
import { SearchCursor } from "@app/feature/search/SearchCursor";

const underTest: typeof SearchCursor = SearchCursor;

describe("SearchCursor.moved", () => {
    it("givenAPlaceInTheList_whenSteppingDown_thenTheNextOneIsTaken", () => {
        expect(underTest.moved(0, 1, 3)).toBe(1);
    });

    it("givenTheFootOfTheList_whenSteppingDown_thenTheHeadIsTaken", () => {
        expect(underTest.moved(2, 1, 3)).toBe(0);
    });

    it("givenTheHeadOfTheList_whenSteppingUp_thenTheFootIsTaken", () => {
        expect(underTest.moved(0, -1, 3)).toBe(2);
    });

    it("givenAnEmptyList_whenStepping_thenThePlaceIsKept", () => {
        expect(underTest.moved(0, 1, 0)).toBe(0);
    });
});
