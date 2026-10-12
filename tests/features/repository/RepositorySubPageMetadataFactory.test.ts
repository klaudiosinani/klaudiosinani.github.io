import { describe, expect, it } from "vitest";
import type { RepositoryManual } from "@app/feature/repository/RepositoryManual";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import { RepositorySubPageMetadataFactory } from "@app/feature/repository/factory/RepositorySubPageMetadataFactory";

const underTest: typeof RepositorySubPageMetadataFactory = RepositorySubPageMetadataFactory;

const SITE_TITLE: string = "Klaudio Sinani";
const AUTHOR: string = "Klaudio Sinani";

const manual = (sections: string[]): RepositoryManual => ({
    html: "<p>x</p>",
    headings: sections.map((text: string, index: number) => ({
        depth: 2,
        slug: `s${index}`,
        text,
    })),
    install: null,
    related: [],
});

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

describe("RepositorySubPageMetadataFactory.manual", () => {
    it("givenAManual_whenWritingTheTitle_thenItNamesTheProjectAndTheSubject", () => {
        expect(underTest.manual(profile(), SITE_TITLE, AUTHOR).title).toBe("Signale.js documentation - Klaudio Sinani");
    });

    it("givenTheSectionsOfAManual_whenWritingTheDescription_thenTheyAreNamed", () => {
        const { description } = underTest.manual(
            profile({
                manual: manual(["Install", "Usage", "Configuration", "Team", "License"]),
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("install, usage, configuration, team.");
        expect(description).not.toContain("license");
    });

    it("givenAManualWithNoSections_whenWritingTheDescription_thenTheProjectIsStated", () => {
        expect(underTest.manual(profile(), SITE_TITLE, AUTHOR).description).toContain(
            "Highly configurable logging library."
        );
    });

    it("givenAnyManual_whenWritingTheDescription_thenItFillsTheSnippetAndNoMore", () => {
        for (const sections of [[], ["Install"], ["Install", "Usage", "Team"]]) {
            const { description } = underTest.manual(profile({ manual: manual(sections) }), SITE_TITLE, AUTHOR);

            expect(description.length).toBeLessThanOrEqual(160);
        }
    });
});

describe("RepositorySubPageMetadataFactory.releases", () => {
    const release = (tag: string) => ({
        tag,
        name: tag,
        publishedAt: "2026-08-09T09:12:00Z",
        notes: "",
        url: `https://github.com/klaudiosinani/signale/releases/tag/${tag}`,
        downloads: 0,
    });

    it("givenTheReleasesOfAProject_whenWritingTheTitle_thenBothAreNamed", () => {
        expect(underTest.releases(profile({ releases: [release("v4.2.0")] }), SITE_TITLE, AUTHOR).title).toBe(
            "Signale.js releases - Klaudio Sinani"
        );
    });

    it("givenSeveralReleases_whenWritingTheDescription_thenTheCountAndTheNewestAreStated", () => {
        const { description } = underTest.releases(
            profile({ releases: [release("v4.2.0"), release("v4.1.0")] }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("2 releases of Signale.js by Klaudio Sinani.");
        expect(description).toContain("v4.2.0 is the newest");
        expect(description.length).toBeLessThanOrEqual(160);
    });

    it("givenAProjectThatHasPublishedNothing_whenWriting_thenNoNewestOneIsNamed", () => {
        const { description } = underTest.releases(profile(), SITE_TITLE, AUTHOR);

        expect(description).toContain("0 releases of Signale.js");
        expect(description).not.toContain("is the newest");
    });

    it("givenOneRelease_whenWritingTheDescription_thenTheCountReadsAsASingular", () => {
        expect(
            underTest.releases(profile({ releases: [release("v1.0.0")] }), SITE_TITLE, AUTHOR).description
        ).toContain("1 release of Signale.js");
    });
});
