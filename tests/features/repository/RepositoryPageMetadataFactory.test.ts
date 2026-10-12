import { describe, expect, it } from "vitest";
import { RepositoryPageMetadataFactory } from "@app/feature/repository/factory/RepositoryPageMetadataFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";

const underTest: typeof RepositoryPageMetadataFactory = RepositoryPageMetadataFactory;

const SITE_TITLE: string = "Klaudio Sinani";
const AUTHOR: string = "Klaudio Sinani";

const profile = (overrides: Partial<RepositoryProfile> = {}): RepositoryProfile => ({
    slug: "signale",
    name: "Signale.js",
    logline: "Highly configurable logging library",
    description: "Configurable to the core.",
    url: "https://github.com/klaudiosinani/signale",
    language: "JavaScript",
    license: "MIT",
    topics: ["logging", "cli"],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 9179,
    forks: 231,
    downloads: { total: 41_872_004, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [],
    totals: null,
    packages: [],
    latestCommit: null,
    languages: [
        { name: "JavaScript", share: 0.73 },
        { name: "TypeScript", share: 0.27 },
    ],
    contributors: 9,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
    ...overrides,
});

describe("RepositoryPageMetadataFactory.create", () => {
    it("givenACuratedTitle_whenWritingTheTitle_thenItIsUsedAsItIsWritten", () => {
        const { title } = underTest.create(
            profile({ seoTitle: "Arare - Auto-curried functional library" }),
            SITE_TITLE,
            AUTHOR
        );

        expect(title).toBe("Arare - Auto-curried functional library");
    });

    it("givenAProjectMadeYearsAgo_whenWritingTheDescription_thenTheSnippetStatesHowLongItHasRun", () => {
        const { description } = underTest.create(
            profile({
                logline: "A logger",
                languages: [],
                license: null,
                downloads: { total: null, sources: [], caveats: [] },
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("In development since 2017.");
    });

    it("givenASummaryThatFits_whenWritingTheTitle_thenItStatesWhatTheProjectIs", () => {
        const { title } = underTest.create(profile(), SITE_TITLE, AUTHOR);

        expect(title).toBe("Signale.js - Highly configurable logging library");
    });

    it("givenALongSummary_whenWritingTheTitle_thenTheNameOfTheSiteIsUsedInstead", () => {
        const { title } = underTest.create(
            profile({
                name: "Taskbook",
                logline: "Tasks, boards and notes for the command-line habitat",
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(title).toBe("Taskbook - Klaudio Sinani");
    });

    it("givenAWholeProfile_whenWritingTheDescription_thenItFillsTheSnippet", () => {
        const { description } = underTest.create(profile(), SITE_TITLE, AUTHOR);

        expect(description.length).toBeGreaterThanOrEqual(120);
        expect(description.length).toBeLessThanOrEqual(160);
    });

    it("givenAWholeProfile_whenWritingTheDescription_thenTheFactsAreInTheOrderTheyAreRead", () => {
        const { description } = underTest.create(profile(), SITE_TITLE, AUTHOR);

        expect(description).toBe(
            "Signale.js by Klaudio Sinani: Highly configurable logging library. " +
                "Written in JavaScript and TypeScript. 41.9M downloads, 9,179 stars. " +
                "Open source under MIT."
        );
    });

    it("givenASummaryThatEndsInAStop_whenWritingTheDescription_thenItIsNotGivenASecondOne", () => {
        const { description } = underTest.create(
            profile({ logline: "Refined Evernote desktop app." }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("Refined Evernote desktop app.");
        expect(description).not.toContain("app..");
    });

    it("givenARepositoryWithNothingMeasured_whenWritingTheDescription_thenNoZeroIsStated", () => {
        const { description } = underTest.create(
            profile({
                languages: [],
                license: null,
                stars: 0,
                forks: 0,
                downloads: { total: null, sources: [], caveats: [] },
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toBe(
            "Signale.js by Klaudio Sinani: Highly configurable logging library. " + "In development since 2017."
        );
    });

    it("givenAProjectWithNoRegistry_whenWritingTheDescription_thenTheStarsStillLead", () => {
        const { description } = underTest.create(
            profile({ downloads: { total: null, sources: [], caveats: [] } }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("9,179 stars, 231 forks.");
    });

    it("givenALongSummaryAndEveryFact_whenWritingTheDescription_thenNothingOverrunsTheSnippet", () => {
        const { description } = underTest.create(
            profile({
                name: "Taskbook",
                logline: "Tasks, boards and notes for the command-line habitat, kept in one place",
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description.length).toBeLessThanOrEqual(160);
        expect(description).toContain("Written in JavaScript and TypeScript.");
    });

    it("givenARegistryAndARelease_whenWritingTheDescription_thenBothAreStated", () => {
        const { description } = underTest.create(
            profile({
                logline: "A logger",
                languages: [],
                license: null,
                downloads: { total: null, sources: [], caveats: [] },
                packages: [
                    {
                        registry: "npm",
                        label: "npm",
                        url: "https://www.npmjs.com/package/signale",
                        version: "4.2.0",
                    },
                    {
                        registry: "snapcraft",
                        label: "Snap",
                        url: "https://snapcraft.io/signale",
                        version: "0.3.0",
                    },
                ],
                releases: [
                    {
                        tag: "v4.2.0",
                        name: "v4.2.0",
                        publishedAt: "2026-08-09T09:12:00Z",
                        notes: "",
                        url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
                        downloads: 0,
                    },
                ],
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("Available on npm and Snap.");
        expect(description).toContain("Latest release v4.2.0.");
    });

    it("givenOneRegistry_whenWritingTheDescription_thenItIsNamedOnItsOwn", () => {
        const { description } = underTest.create(
            profile({
                packages: [
                    {
                        registry: "npm",
                        label: "npm",
                        url: "https://www.npmjs.com/package/signale",
                        version: "4.2.0",
                    },
                ],
                languages: [],
                license: null,
                downloads: { total: null, sources: [], caveats: [] },
                stars: 0,
                forks: 0,
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("Available on npm.");
    });

    it("givenMoreThanTwoLanguages_whenWritingTheDescription_thenTheTwoLargestAreNamed", () => {
        const { description } = underTest.create(
            profile({
                languages: [
                    { name: "JavaScript", share: 0.6 },
                    { name: "TypeScript", share: 0.3 },
                    { name: "Shell", share: 0.1 },
                ],
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("Written in JavaScript and TypeScript.");
        expect(description).not.toContain("Shell");
    });
});
