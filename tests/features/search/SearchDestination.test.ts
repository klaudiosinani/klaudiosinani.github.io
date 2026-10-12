import { afterEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { SearchDestination } from "@app/feature/search/SearchDestination";

const underTest: typeof SearchDestination = SearchDestination;

interface Page {
    open: Mock;
    location: { href: string };
}

const page = (): Page => {
    const held: Page = { open: vi.fn(), location: { href: "/" } };

    vi.stubGlobal("window", held);

    return held;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("SearchDestination.isAway", () => {
    it("givenAnAddressOfAnotherSite_whenAsked_thenItLeavesThisOne", () => {
        expect(underTest.isAway("https://linuxmagazine.com/article")).toBe(true);
    });

    it("givenAPageOfThisSite_whenAsked_thenItStays", () => {
        expect(underTest.isAway("/signale/")).toBe(false);
    });
});

describe("SearchDestination.open", () => {
    it("givenAResultOfAnotherSite_whenOpened_thenItStandsBesideThisPage", () => {
        const held: Page = page();

        underTest.open("https://omgubuntu.co.uk/taskbook");

        expect(held.open).toHaveBeenCalledWith("https://omgubuntu.co.uk/taskbook", "_blank", "noopener,noreferrer");
    });

    it("givenAResultOfThisSite_whenOpened_thenThePageIsTurned", () => {
        const held: Page = page();

        underTest.open("/publications/");

        expect(held.location.href).toBe("/publications/");
        expect(held.open).not.toHaveBeenCalled();
    });
});
