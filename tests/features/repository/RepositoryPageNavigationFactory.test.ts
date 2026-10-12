import { describe, expect, it } from "vitest";
import { RepositoryPageNavigationFactory } from "@app/feature/repository/factory/RepositoryPageNavigationFactory";
import type { RepositoryManual } from "@app/feature/repository/RepositoryManual";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";
import type { RepositoryPage } from "@app/feature/repository/factory/RepositoryPageNavigationFactory";
const underTest: typeof RepositoryPageNavigationFactory = RepositoryPageNavigationFactory;

const manual: RepositoryManual = {
    html: "<p>x</p>",
    headings: [],
    install: null,
    related: [],
};

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "Highly configurable logging library",
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
    releases: [],
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

const labels = (pages: { label: string }[]): string[] => pages.map(({ label }: { label: string }) => label);

const release: RepositoryRelease = {
    tag: "v4.2.0",
    name: "v4.2.0",
    publishedAt: "2026-08-09T09:12:00Z",
    notes: "",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
    downloads: 0,
};

describe("RepositoryPageNavigationFactory.create", () => {
    it("givenAWholeProject_whenNaming_thenTheFiguresAreTheFirstPage", () => {
        expect(labels(underTest.create(profile({ manual, releases: [release] }), "activity"))).toEqual([
            "Activity",
            "Documentation",
            "Releases",
        ]);
    });

    it("givenAProjectWithNoManual_whenNaming_thenNoManualIsOffered", () => {
        expect(labels(underTest.create(profile(), "activity"))).toEqual(["Activity"]);
    });

    it("givenAProjectWithNoRelease_whenNaming_thenNoReleasesAreOffered", () => {
        expect(labels(underTest.create(profile({ manual }), "activity"))).toEqual(["Activity", "Documentation"]);
    });

    it("givenThePageAReaderIsOn_whenNaming_thenOnlyThatOneIsMarked", () => {
        const pages: RepositoryPage[] = underTest.create(profile({ manual }), "activity");

        expect(pages.filter(({ current }: RepositoryPage) => current).map(({ key }: RepositoryPage) => key)).toEqual([
            "activity",
        ]);
    });

    it("givenEveryPage_whenNaming_thenItsAddressSitsUnderTheProject", () => {
        expect(
            underTest
                .create(profile({ manual, releases: [release] }), "activity")
                .map(({ href }: RepositoryPage) => href)
        ).toEqual(["/signale/", "/signale/documentation/", "/signale/releases/"]);
    });
});
