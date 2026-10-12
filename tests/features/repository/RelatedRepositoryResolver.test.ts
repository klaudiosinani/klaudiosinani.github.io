import { describe, expect, it } from "vitest";
import { RelatedRepositoryResolver } from "@app/feature/repository/service/RelatedRepositoryResolver";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

const underTest: typeof RelatedRepositoryResolver = RelatedRepositoryResolver;

const LIMIT: number = 3;

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "",
    description: "",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: ["logging", "cli"],
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

const repository = (name: string, overrides: Partial<RepositoryData> = {}): RepositoryData => ({
    name,
    description: "",
    url: `https://github.com/klaudiosinani/${name}`,
    stars: 100,
    forks: 10,
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-01T00:00:00Z",
    latestUpdate: "2026-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
    ...overrides,
});

const names = (repositories: RepositoryData[]): string[] => repositories.map(({ name }: RepositoryData) => name);

const manual = (related: string[]) => ({
    html: "",
    headings: [],
    install: null,
    related,
});

describe("RelatedRepositoryResolver.resolve, with a readme that states them", () => {
    it("givenAReadmeThatNamesRelatedWork_whenResolving_thenItsOrderIsKept", () => {
        const candidates: RepositoryData[] = [
            repository("hyperocean", { stars: 5, topics: [] }),
            repository("qoa", { topics: ["cli"] }),
        ];

        const related: RepositoryData[] = underTest.resolve(
            profile({ manual: manual(["hyperocean", "qoa"]) }),
            candidates,
            LIMIT
        );

        expect(names(related)).toEqual(["hyperocean", "qoa"]);
    });

    it("givenAReadmeThatNamesTooFew_whenResolving_thenTheNearestOfTheRestFollow", () => {
        const candidates: RepositoryData[] = [
            repository("hyperocean", { topics: [] }),
            repository("qoa", { topics: ["cli", "logging"] }),
        ];

        const related: RepositoryData[] = underTest.resolve(
            profile({ manual: manual(["hyperocean"]) }),
            candidates,
            LIMIT
        );

        expect(names(related)).toEqual(["hyperocean", "qoa"]);
    });

    it("givenAProjectNamedTwiceOver_whenResolving_thenItIsShownOnce", () => {
        const candidates: RepositoryData[] = [repository("qoa", { topics: ["cli"] })];

        const related: RepositoryData[] = underTest.resolve(profile({ manual: manual(["qoa"]) }), candidates, LIMIT);

        expect(names(related)).toEqual(["qoa"]);
    });

    it("givenAReadmeThatNamesWorkWithNoPage_whenResolving_thenThatNameIsPassedOver", () => {
        const candidates: RepositoryData[] = [repository("qoa", { topics: ["cli"] })];

        const related: RepositoryData[] = underTest.resolve(
            profile({ manual: manual(["retired", "qoa"]) }),
            candidates,
            LIMIT
        );

        expect(names(related)).toEqual(["qoa"]);
    });

    it("givenAReadmeThatNamesMoreThanTheRowHolds_whenResolving_thenOnlyTheFirstAreShown", () => {
        const candidates: RepositoryData[] = ["one", "two", "three", "four"].map((name: string) =>
            repository(name, { topics: [] })
        );

        const related: RepositoryData[] = underTest.resolve(
            profile({ manual: manual(["one", "two", "three", "four"]) }),
            candidates,
            LIMIT
        );

        expect(names(related)).toEqual(["one", "two", "three"]);
    });
});

describe("RelatedRepositoryResolver.resolve", () => {
    it("givenASharedSubject_whenResolving_thenItOutranksASharedLanguage", () => {
        const candidates: RepositoryData[] = [
            repository("plain", { topics: [] }),
            repository("kindred", { topics: ["cli"], language: "Python" }),
        ];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["kindred", "plain"]);
    });

    it("givenTwoSharedSubjects_whenResolving_thenTheNearerProjectLeads", () => {
        const candidates: RepositoryData[] = [
            repository("one", { topics: ["cli"] }),
            repository("two", { topics: ["cli", "logging"] }),
        ];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["two", "one"]);
    });

    it("givenTheProjectItself_whenResolving_thenItIsNotOfferedAsRelated", () => {
        const candidates: RepositoryData[] = [repository("signale"), repository("qoa")];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["qoa"]);
    });

    it("givenARepositoryNamedAfterARoute_whenResolving_thenItIsLeftOut", () => {
        const candidates: RepositoryData[] = [repository("about"), repository("qoa")];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["qoa"]);
    });

    it("givenNothingInCommon_whenResolving_thenNothingIsOffered", () => {
        const candidates: RepositoryData[] = [repository("stranger", { language: "Rust", topics: ["gaming"] })];

        expect(underTest.resolve(profile(), candidates, LIMIT)).toEqual([]);
    });

    it("givenEqualScores_whenResolving_thenTheMoreStarredProjectLeads", () => {
        const candidates: RepositoryData[] = [repository("small", { stars: 10 }), repository("large", { stars: 900 })];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["large", "small"]);
    });

    it("givenEqualScoresAndStars_whenResolving_thenTheOrderIsTheSameOnEveryBuild", () => {
        const candidates: RepositoryData[] = [repository("zebra"), repository("alpha")];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["alpha", "zebra"]);
    });

    it("givenManyRelatedProjects_whenResolving_thenOnlyTheAskedNumberIsReturned", () => {
        const candidates: RepositoryData[] = ["one", "two", "three", "four"].map((name: string) =>
            repository(name, { topics: ["cli"] })
        );

        expect(underTest.resolve(profile(), candidates, LIMIT)).toHaveLength(LIMIT);
    });

    it("givenSubjectsWrittenInAnotherCase_whenResolving_thenTheyStillMatch", () => {
        const candidates: RepositoryData[] = [repository("shouty", { topics: ["CLI"] })];

        expect(names(underTest.resolve(profile(), candidates, LIMIT))).toEqual(["shouty"]);
    });

    it("givenARepositoryOfProseWithNoLanguage_whenResolving_thenNothingIsClaimed", () => {
        const candidates: RepositoryData[] = [repository("notes", { language: null })];

        expect(underTest.resolve(profile({ language: null }), candidates, LIMIT)).toEqual([]);
    });
});
