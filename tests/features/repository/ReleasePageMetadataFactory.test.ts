import { describe, expect, it } from "vitest";
import { ReleasePageMetadataFactory } from "@app/feature/repository/factory/ReleasePageMetadataFactory";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryRelease } from "@app/feature/repository/RepositoryRelease";

const underTest: typeof ReleasePageMetadataFactory = ReleasePageMetadataFactory;

const SITE_TITLE: string = "Klaudio Sinani";
const AUTHOR: string = "Klaudio Sinani";

const release = (overrides: Partial<RepositoryRelease> = {}): RepositoryRelease => ({
    tag: "v4.2.0",
    name: "Signale v4.2.0",
    publishedAt: "2026-08-09T09:12:00Z",
    notes: "## Highlights\n\n- Adds a `scope` option to every interactive logger. It is set once and carried through.\n",
    url: "https://github.com/klaudiosinani/signale/releases/tag/v4.2.0",
    downloads: 1_284,
    ...overrides,
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

describe("ReleasePageMetadataFactory.create", () => {
    it("givenARelease_whenWritingTheTitle_thenItNamesTheProjectAndTheVersion", () => {
        expect(underTest.create(profile(), release(), SITE_TITLE, AUTHOR).title).toBe(
            "Signale.js v4.2.0 release notes - Klaudio Sinani"
        );
    });

    it("givenARelease_whenWritingTheDescription_thenItOpensWithWhoAndWhen", () => {
        const { description } = underTest.create(profile(), release(), SITE_TITLE, AUTHOR);

        expect(description.startsWith("Signale.js v4.2.0 by Klaudio Sinani,")).toBe(true);
        expect(description).toContain("2026");
    });

    it("givenNotesInMarkdown_whenWritingTheDescription_thenTheMarksAreLeftOut", () => {
        const { description } = underTest.create(profile(), release(), SITE_TITLE, AUTHOR);

        expect(description).not.toContain("#");
        expect(description).not.toContain("`");
        expect(description).toContain("Adds a scope option");
    });

    it("givenAnyRelease_whenWritingTheDescription_thenItFillsTheSnippetAndNoMore", () => {
        for (const notes of ["", "A short note.", "A. ".repeat(200)]) {
            const { description } = underTest.create(profile(), release({ notes }), SITE_TITLE, AUTHOR);

            expect(description.length).toBeLessThanOrEqual(160);
            expect(description.length).toBeGreaterThanOrEqual(60);
        }
    });

    it("givenNoNotesAndNoDownloads_whenWritingTheDescription_thenTheProjectIsStated", () => {
        const { description } = underTest.create(profile(), release({ notes: "", downloads: 0 }), SITE_TITLE, AUTHOR);

        expect(description).toContain("Highly configurable logging library.");
    });

    it("givenFilesThatWereTaken_whenWritingTheDescription_thenTheCountIsStated", () => {
        const { description } = underTest.create(profile(), release({ notes: "" }), SITE_TITLE, AUTHOR);

        expect(description).toContain("1,284 downloads");
    });
});

describe("ReleasePageMetadataFactory.create, where no sentence fits", () => {
    it("givenNotesWithNoStopInThem_whenWritingTheDescription_thenTheWordsFillTheSnippet", () => {
        const { description } = underTest.create(
            profile({ logline: "A logger" }),
            release({
                downloads: 0,
                notes: "## Highlights\n\n- Adds a scope option to every interactive logger\n- Restores colour detection under NO_COLOR\n- Fixes the timestamp format on Windows terminals\n",
            }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description).toContain("Adds a scope option");
        expect(description.endsWith("…")).toBe(true);
        expect(description.length).toBeLessThanOrEqual(160);
        expect(description.length).toBeGreaterThanOrEqual(120);
    });

    it("givenNotesThatAlreadyEndInAStop_whenFillingTheSnippet_thenNoSecondOneIsAdded", () => {
        const { description } = underTest.create(
            profile({ logline: "A logger" }),
            release({ notes: "Fixed.", downloads: 0 }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description.endsWith("Fixed.")).toBe(true);
        expect(description).not.toContain("Fixed..");
    });

    it("givenNotesTooShortToFillWhatIsLeft_whenWritingTheDescription_thenNothingIsCut", () => {
        const { description } = underTest.create(
            profile({ logline: "A logger" }),
            release({ notes: "Small fix", downloads: 0 }),
            SITE_TITLE,
            AUTHOR
        );

        expect(description.endsWith("…")).toBe(false);
    });
});
