import { describe, expect, it } from "vitest";
import { ReleaseCadenceFormatter } from "@app/feature/repository/service/ReleaseCadenceFormatter";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

const underTest: typeof ReleaseCadenceFormatter = ReleaseCadenceFormatter;

const release = (tag: string, publishedAt: string): RepositoryRelease => ({
    tag,
    name: tag,
    publishedAt,
    notes: "",
    url: `https://github.com/user/repo/releases/tag/${tag}`,
    downloads: 0,
});

describe("ReleaseCadenceFormatter.format", () => {
    it("givenAHistoryOfReleases_whenFormatting_thenTheCountAndBothEndsAreStated", () => {
        expect(
            underTest.format([release("v2.0.0", "2026-08-09T00:00:00Z"), release("v1.0.0", "2023-11-02T00:00:00Z")])
        ).toBe("2 releases, latest Aug 9, 2026, first Nov 2, 2023");
    });

    it("givenOneRelease_whenFormatting_thenNoFirstDateIsStatedTwice", () => {
        expect(underTest.format([release("v1.0.0", "2023-11-02T00:00:00Z")])).toBe("1 release, latest Nov 2, 2023");
    });

    it("givenNoReleases_whenFormatting_thenNothingIsStated", () => {
        expect(underTest.format([])).toBeNull();
    });
});
