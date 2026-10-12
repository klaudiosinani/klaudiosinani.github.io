import { describe, expect, it } from "vitest";
import { ReleaseAddressResolver } from "@app/feature/repository/service/ReleaseAddressResolver";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

const underTest: typeof ReleaseAddressResolver = ReleaseAddressResolver;

const WRITTEN_UP: string = "What changed in this release. ".repeat(10);

const release = (over: Partial<RepositoryRelease> = {}): RepositoryRelease => ({
    tag: "v4.2.0",
    name: "v4.2.0",
    publishedAt: "2026-01-01T00:00:00Z",
    notes: WRITTEN_UP,
    url: "https://github.com/user/signale/releases/tag/v4.2.0",
    downloads: 0,
    ...over,
});

describe("ReleaseAddressResolver.of", () => {
    it("givenAReleaseOfAProject_whenResolved_thenItsPageIsAddressed", () => {
        expect(underTest.of("signale", release())).toBe("/signale/releases/v4.2.0/");
    });
});

describe("ReleaseAddressResolver.published", () => {
    it("givenAReleaseThatWasWrittenUp_whenResolved_thenItIsAddressed", () => {
        expect(underTest.published("signale", release())).toBe("/signale/releases/v4.2.0/");
    });

    it("givenAReleaseWithNoNotes_whenResolved_thenNoAddressIsStated", () => {
        expect(underTest.published("signale", release({ notes: "" }))).toBeNull();
    });
});
