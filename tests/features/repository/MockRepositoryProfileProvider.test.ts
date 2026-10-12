import { describe, expect, it } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import { MockRepositoryProfileProvider } from "@app/feature/repository/service/MockRepositoryProfileProvider";

import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
const underTest: MockRepositoryProfileProvider = new MockRepositoryProfileProvider();

describe("MockRepositoryProfileProvider.provide", () => {
    it("givenASlug_whenProviding_thenTheProfileIsBuiltAroundIt", async () => {
        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );

        expect(profile?.slug).toBe("signale");
        expect(profile?.url).toContain("/signale");
    });

    it("givenAnyOtherSlug_whenProviding_thenTheThinProfileStandsInSoEmptyStatesAreVisible", async () => {
        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "binstree")
        );

        expect(profile?.slug).toBe("binstree");
        expect(profile?.releases).toEqual([]);
        expect(profile?.packages).toEqual([]);
        expect(profile?.downloads.total).toBeNull();
        expect(profile?.trend).toEqual([]);
        expect(profile?.latestCommit?.checks).toBeNull();
    });

    it("givenTheStandInProfile_whenProviding_thenReleasesRunNewestFirst", async () => {
        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );
        const stamps: number[] = (profile?.releases ?? []).map((release: RepositoryRelease) =>
            Date.parse(release.publishedAt)
        );

        expect(stamps).toEqual([...stamps].sort((first: number, second: number) => second - first));
    });

    it("givenTheStandInProfile_whenProviding_thenOneReleaseCarriesNoNotesAndOneCarriesMarkdown", async () => {
        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );
        const notes: string[] = (profile?.releases ?? []).map((release: RepositoryRelease) => release.notes);

        expect(notes.some((entry: string) => entry === "")).toBe(true);
        expect(notes.some((entry: string) => entry.includes("- "))).toBe(true);
    });

    it("givenTheStandInProfile_whenProviding_thenTheTrendHasAShapeToPlot", async () => {
        const profile: RepositoryProfile | null = await underTest.provide(
            new RepositoryRef("klaudiosinani", "signale")
        );
        const trend: number[] = profile?.trend ?? [];

        expect(trend.length).toBeGreaterThan(100);
        expect(new Set(trend).size).toBeGreaterThan(100);
    });
});
