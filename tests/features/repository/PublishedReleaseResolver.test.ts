import { describe, expect, it } from "vitest";
import { PublishedReleaseResolver } from "@app/feature/repository/service/PublishedReleaseResolver";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

const underTest: typeof PublishedReleaseResolver = PublishedReleaseResolver;

const release = (tag: string, notes: string, overrides: Partial<RepositoryRelease> = {}): RepositoryRelease => ({
    tag,
    name: tag,
    publishedAt: "2026-08-09T09:12:00Z",
    notes,
    url: `https://github.com/klaudiosinani/signale/releases/tag/${tag}`,
    downloads: 0,
    ...overrides,
});

const written: string = "A".repeat(200);

describe("PublishedReleaseResolver.resolve", () => {
    it("givenAReleaseThatWasWrittenUp_whenResolving_thenItIsGivenAPage", () => {
        expect(underTest.resolve([release("v4.2.0", written)])).toHaveLength(1);
    });

    it("givenAReleaseWithALineOfNotes_whenResolving_thenItIsLeftOnGitHub", () => {
        expect(underTest.resolve([release("v1.0.1", "Fixes a typo.")])).toEqual([]);
    });

    it("givenAReleaseWithNoNotes_whenResolving_thenNoPageIsMade", () => {
        expect(underTest.resolve([release("v1.0.0", "  ")])).toEqual([]);
    });

    it("givenATagNamedLatest_whenResolving_thenItIsLeftOut", () => {
        expect(underTest.resolve([release("latest", written)])).toEqual([]);
    });

    it("givenSeveralReleases_whenResolving_thenTheirOrderIsKept", () => {
        const resolved: RepositoryRelease[] = underTest.resolve([
            release("v4.2.0", written),
            release("v4.1.0", "short"),
            release("v4.0.0", written),
        ]);

        expect(resolved.map(({ tag }: RepositoryRelease) => tag)).toEqual(["v4.2.0", "v4.0.0"]);
    });
});

describe("PublishedReleaseResolver.publishes", () => {
    it("givenOneRelease_whenAsked_thenItAnswersAsTheListWould", () => {
        expect(underTest.publishes(release("v4.2.0", written))).toBe(true);
        expect(underTest.publishes(release("v4.2.0", "short"))).toBe(false);
    });
});
