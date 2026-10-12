import { describe, expect, it } from "vitest";
import { FeaturedSoftwareResolver } from "@app/feature/software/service/FeaturedSoftwareResolver";
import type { FeaturedSoftware } from "@app/feature/software/FeaturedSoftware";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

import type { FeaturedSoftwareEntry } from "@app/feature/software/FeaturedSoftwareEntry";
const underTest: typeof FeaturedSoftwareResolver = FeaturedSoftwareResolver;

const featured = (overrides: Partial<FeaturedSoftware> = {}): FeaturedSoftware => ({
    name: "Signale.js",
    logline: "Highly configurable logging library",
    description: "…",
    url: "https://github.com/klaudiosinani/signale",
    order: 1,
    ...overrides,
});

const repository = (overrides: Partial<RepositoryData> = {}): RepositoryData => ({
    name: "signale",
    description: "",
    url: "https://github.com/klaudiosinani/signale",
    stars: 9179,
    forks: 231,
    language: "JavaScript",
    latestUpdate: "2026-01-01T00:00:00Z",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
    ...overrides,
});

describe("FeaturedSoftwareResolver.resolve", () => {
    it("givenAMatchingRepository_whenResolving_thenLiveFiguresReplaceNothingCurated", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve([featured()], [repository()]);

        expect(entries[0].logline).toBe("Highly configurable logging library");
        expect(entries[0]).toMatchObject({
            stars: 9179,
            forks: 231,
            language: "JavaScript",
        });
    });

    it("givenADisplayNameUnlikeTheRepository_whenResolving_thenTheUrlDecidesTheMatch", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve([featured()], [repository()]);

        expect(entries[0].stars).toBe(9179);
    });

    it("givenATrailingSlashOnTheUrl_whenResolving_thenItStillMatches", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve(
            [featured({ url: "https://github.com/klaudiosinani/signale/" })],
            [repository()]
        );

        expect(entries[0].stars).toBe(9179);
    });

    it("givenDifferingCase_whenResolving_thenItStillMatches", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve(
            [featured({ url: "https://github.com/klaudiosinani/Signale" })],
            [repository({ name: "signale" })]
        );

        expect(entries[0].forks).toBe(231);
    });

    it("givenNoMatchingRepository_whenResolving_thenFiguresAreAbsentRatherThanZero", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve([featured()], []);

        expect(entries[0]).toMatchObject({
            stars: null,
            forks: null,
            language: null,
        });
    });

    it("givenARepositoryWithoutALanguage_whenResolving_thenTheLanguageIsAbsent", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve([featured()], [repository({ language: null })]);

        expect(entries[0].language).toBeNull();
        expect(entries[0].stars).toBe(9179);
    });

    it("givenNoFeaturedSoftware_whenResolving_thenNothingIsProduced", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.resolve([], [repository()]);

        expect(entries).toEqual([]);
    });

    it("givenAMatchedRepository_whenResolving_thenItsNameBecomesTheSlugTheCardLinksTo", () => {
        const [resolved] = underTest.resolve(
            [featured({ url: "https://github.com/klaudiosinani/signale" })],
            [repository({ name: "signale" })]
        );

        expect(resolved.slug).toBe("signale");
    });

    it("givenNoMatchingRepository_whenResolving_thenThereIsNoSlugAndSoNoPageToLinkTo", () => {
        const [resolved] = underTest.resolve(
            [featured({ url: "https://github.com/klaudiosinani/removed" })],
            [repository({ name: "signale" })]
        );

        expect(resolved.slug).toBeNull();
    });

    it("givenSignalsForAMatchedRepository_whenResolving_thenTheyReachTheCard", () => {
        const signals: Map<
            string,
            {
                languages: string[];
                openIssues: number;
                openPullRequests: number;
                latestRelease: string;
                latestCommit: string;
                starHistory: number[];
            }
        > = new Map([
            [
                "signale",
                {
                    languages: ["JavaScript", "TypeScript"],
                    openIssues: 29,
                    openPullRequests: 10,
                    latestRelease: "v1.4.0",
                    latestCommit: "9f2c1ab",
                    starHistory: [],
                },
            ],
        ]);

        const [resolved] = underTest.resolve([featured()], [repository()], signals);

        expect(resolved.languages).toEqual(["JavaScript", "TypeScript"]);
        expect(resolved.openIssues).toBe(29);
        expect(resolved.openPullRequests).toBe(10);
        expect(resolved.latestRelease).toBe("v1.4.0");
        expect(resolved.latestCommit).toBe("9f2c1ab");
    });

    it("givenNoSignals_whenResolving_thenTheLeadingLanguageStillStandsIn", () => {
        const [resolved] = underTest.resolve([featured()], [repository()]);

        expect(resolved.languages).toEqual(["JavaScript"]);
        expect(resolved.openIssues).toBeNull();
        expect(resolved.openPullRequests).toBeNull();
        expect(resolved.latestRelease).toBeNull();
        expect(resolved.latestCommit).toBeNull();
    });

    it("givenARepositoryWithoutAnyLanguage_whenResolving_thenNoneIsInvented", () => {
        const [resolved] = underTest.resolve([featured()], [repository({ language: null })]);

        expect(resolved.languages).toEqual([]);
    });
});

describe("FeaturedSoftwareResolver.fromRepositories", () => {
    const signals: Map<
        string,
        {
            languages: string[];
            openIssues: number;
            openPullRequests: number;
            latestRelease: string;
            latestCommit: string;
            starHistory: number[];
        }
    > = new Map([
        [
            "signale",
            {
                languages: ["JavaScript", "TypeScript"],
                openIssues: 29,
                openPullRequests: 10,
                latestRelease: "v4.2.0",
                latestCommit: "a0119bb",
                starHistory: [],
            },
        ],
    ]);

    it("givenACuratedRepository_whenBuilding_thenTheWrittenWordsAreKept", () => {
        const [entry] = underTest.fromRepositories([repository()], [featured()]);

        expect(entry.name).toBe("Signale.js");
        expect(entry.logline).toBe("Highly configurable logging library");
        expect(entry.slug).toBe("signale");
    });

    it("givenARepositoryWithNoCuratedText_whenBuilding_thenItStillHasACard", () => {
        const [entry] = underTest.fromRepositories(
            [
                repository({
                    name: "hyper-pokemon",
                    description: "Tailor-made Pokémon themes",
                    url: "https://github.com/klaudiosinani/hyper-pokemon",
                }),
            ],
            [featured()]
        );

        expect(entry.name).toBe("Hyper Pokemon");
        expect(entry.logline).toBe("Tailor-made Pokémon themes");
        expect(entry.slug).toBe("hyper-pokemon");
    });

    it("givenTheSignalsOfARepository_whenBuilding_thenTheCardCarriesThemAll", () => {
        const [entry] = underTest.fromRepositories([repository()], [featured()], signals);

        expect(entry).toMatchObject({
            languages: ["JavaScript", "TypeScript"],
            openIssues: 29,
            openPullRequests: 10,
            latestRelease: "v4.2.0",
            latestCommit: "a0119bb",
            starHistory: [],
            stars: 9179,
            forks: 231,
        });
    });

    it("givenNoSignals_whenBuilding_thenTheCountsAreAbsentRatherThanZero", () => {
        const [entry] = underTest.fromRepositories([repository()], []);

        expect(entry.openIssues).toBeNull();
        expect(entry.openPullRequests).toBeNull();
        expect(entry.latestRelease).toBeNull();
        expect(entry.languages).toEqual(["JavaScript"]);
    });

    it("givenARepositoryOfProse_whenBuilding_thenNoLanguageIsClaimed", () => {
        const [entry] = underTest.fromRepositories([repository({ language: null })], []);

        expect(entry.languages).toEqual([]);
    });

    it("givenTheOrderOfTheRepositories_whenBuilding_thenItIsTheOrderOfTheCards", () => {
        const entries: FeaturedSoftwareEntry[] = underTest.fromRepositories(
            [repository({ name: "qoa" }), repository({ name: "tusk" })],
            []
        );

        expect(entries.map(({ slug }: FeaturedSoftwareEntry) => slug)).toEqual(["qoa", "tusk"]);
    });
});
