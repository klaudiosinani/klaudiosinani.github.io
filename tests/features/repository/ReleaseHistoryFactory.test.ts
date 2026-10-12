import { describe, expect, it } from "vitest";
import type { PublishedRelease } from "@app/feature/repository/PublishedRelease";
import { ReleaseHistoryFactory } from "@app/feature/repository/factory/ReleaseHistoryFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

const underTest: typeof ReleaseHistoryFactory = ReleaseHistoryFactory;

const release = (tag: string, publishedAt: string): RepositoryRelease => ({
    tag,
    name: tag,
    publishedAt,
    notes: "",
    url: `https://github.com/user/repo/releases/tag/${tag}`,
    downloads: 0,
});

const profile = (slug: string, name: string, releases: RepositoryRelease[]): RepositoryProfile =>
    ({ slug, name, releases }) as RepositoryProfile;

describe("ReleaseHistoryFactory.create", () => {
    it("givenTheReleasesOfSeveralProjects_whenJoining_thenTheNewestLeads", () => {
        const history: PublishedRelease[] = underTest.create([
            profile("signale", "Signale.js", [release("v4.2.0", "2026-08-09")]),
            profile("taskbook", "Taskbook", [release("v2.7.1", "2026-08-30"), release("v2.7.0", "2025-01-01")]),
        ]);

        expect(history.map(({ project, release: held }: PublishedRelease) => `${project} ${held.tag}`)).toEqual([
            "Taskbook v2.7.1",
            "Signale.js v4.2.0",
            "Taskbook v2.7.0",
        ]);
    });

    it("givenARelease_whenJoining_thenItCarriesThePageOfItsProject", () => {
        expect(underTest.create([profile("qoa", "Qoa.js", [release("v1.0.0", "2024-01-01")])])[0].slug).toBe("qoa");
    });

    it("givenAProjectWithNoRelease_whenJoining_thenItGivesNothing", () => {
        expect(underTest.create([profile("arare", "Arare", [])])).toEqual([]);
    });

    it("givenNoProject_whenJoining_thenThereIsNoHistory", () => {
        expect(underTest.create([])).toEqual([]);
    });
});
