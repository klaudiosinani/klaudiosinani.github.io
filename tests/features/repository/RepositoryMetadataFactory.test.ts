import { describe, expect, it } from "vitest";
import { RepositoryMetadataFactory } from "@app/feature/repository/factory/RepositoryMetadataFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

import type { RepositoryCommit } from "@app/feature/repository/RepositoryCommit";
import type { RepositoryMetadatum } from "@app/feature/repository/RepositoryMetadatum";
const underTest: typeof RepositoryMetadataFactory = RepositoryMetadataFactory;

const release: RepositoryRelease = {
    tag: "v4.2.0",
    name: "Signale v4.2.0",
    publishedAt: "2026-08-09T09:12:00Z",
    notes: "",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
    downloads: 0,
};

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "",
    description: "",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 9179,
    forks: 231,
    downloads: { total: null, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [release],
    totals: null,
    packages: [],
    latestCommit: null,
    languages: [],
    contributors: null,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

const labels = (metadata: { label: string }[]): string[] => metadata.map(({ label }: { label: string }) => label);

describe("RepositoryMetadataFactory.create", () => {
    const commit: RepositoryCommit = {
        sha: "a0119bbf2c1ab4d5e6f7890abcdef1234567890a",
        message: "Tighten the public type surface",
        url: "https://github.com/klaudiosinani/signale/commit/a0119bb",
        committedAt: "2026-08-10T16:20:00Z",
        checks: { total: 4, passed: 4, conclusion: "success" as const },
    };

    it("givenAWholeProfile_whenStatingTheFacts_thenTheVersionLeadsTheLine", () => {
        const metadata: RepositoryMetadatum[] = underTest.create(profile({ latestCommit: commit }));

        expect(labels(metadata)).toEqual(["v4.2.0", "a0119bb", "MIT license"]);
    });

    it("givenTheLastCommit_whenStatingIt_thenItLeadsToThatCommit", () => {
        const [, change] = underTest.create(profile({ latestCommit: commit }));

        expect(change.href).toBe(commit.url);
        expect(change.title).toContain("Tighten the public type surface");
    });

    it("givenChecksOnTheLastCommit_whenStatingIt_thenTheirStateIsCarried", () => {
        const [, change] = underTest.create(profile({ latestCommit: commit }));

        expect(change.state).toBe("success");
        expect(change.title).toContain("Checks passed 4/4");
    });

    it("givenACommitWithNoChecks_whenStatingIt_thenNoStateIsClaimed", () => {
        const [, change] = underTest.create(profile({ latestCommit: { ...commit, checks: null } }));

        expect(change.state).toBeUndefined();
        expect(change.title).not.toContain("Checks");
    });

    it("givenARepositoryWithNoCommit_whenStatingTheFacts_thenNoChangeIsStated", () => {
        expect(labels(underTest.create(profile()))).toEqual(["v4.2.0", "MIT license"]);
    });

    it("givenALatestRelease_whenStatingTheVersion_thenItLinksToThatRelease", () => {
        const [version] = underTest.create(profile());

        expect(version.href).toBe(release.url);
        expect(version.title).toContain("2026");
    });

    it("givenSeveralReleases_whenStatingTheVersion_thenTheNewestOneIsUsed", () => {
        const [version] = underTest.create(
            profile({
                releases: [release, { ...release, tag: "v4.1.0" }],
            })
        );

        expect(version.label).toBe("v4.2.0");
    });

    it("givenARepositoryWithNoRelease_whenStatingTheFacts_thenNoVersionIsClaimed", () => {
        const metadata: RepositoryMetadatum[] = underTest.create(profile({ releases: [] }));

        expect(labels(metadata)).toEqual(["MIT license"]);
    });

    it("givenWorkThatOthersDependOn_whenStatingTheFacts_thenTheReachIsStated", () => {
        const facts: RepositoryMetadatum[] = underTest.create(
            profile({
                dependents: { repositories: 154_500, packages: 1_907, notable: [] },
            })
        );

        expect(facts.map(({ label }: RepositoryMetadatum) => label)).toContain("154.5K repositories");
        expect(facts.find(({ label }: RepositoryMetadatum) => label.endsWith("repositories"))?.title).toBe(
            "154.5K repositories and 1,907 packages use this work, as GitHub counts them"
        );
    });

    it("givenNoPackagesDependOnIt_whenStatingTheReach_thenOnlyRepositoriesAreCounted", () => {
        expect(
            underTest
                .create(
                    profile({
                        dependents: { repositories: 12, packages: 0, notable: [] },
                    })
                )
                .find(({ label }: RepositoryMetadatum) => label.endsWith("repositories"))?.title
        ).toBe("12 repositories use this work, as GitHub counts them");
    });

    it("givenNothingDependsOnIt_whenStatingTheFacts_thenNoReachIsClaimed", () => {
        expect(
            underTest
                .create(profile({ dependents: { repositories: 0, packages: 0, notable: [] } }))
                .some(({ label }: RepositoryMetadatum) => label.endsWith("repositories"))
        ).toBe(false);
    });

    it("givenALicenceNamedInFull_whenStatingIt_thenTheWordIsNotSaidTwice", () => {
        const metadata: RepositoryMetadatum[] = underTest.create(profile({ license: "Custom License" }));

        expect(labels(metadata)).toContain("Custom License");
    });

    it("givenARepositoryStatingNoLicence_whenStatingTheFacts_thenNoTermsAreClaimed", () => {
        const metadata: RepositoryMetadatum[] = underTest.create(profile({ license: null }));

        expect(labels(metadata)).toEqual(["v4.2.0"]);
    });

    it("givenEveryFact_whenStatingIt_thenItCarriesAMarkOfItsOwn", () => {
        for (const { icon } of underTest.create(profile())) {
            expect(icon).toBeTypeOf("function");
        }
    });
});
