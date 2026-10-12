import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { PublicationLastModifiedResolver } from "@app/infrastructure/sitemap/service/PublicationLastModifiedResolver";
import { join } from "node:path";
import { tmpdir } from "node:os";

const underTest: typeof PublicationLastModifiedResolver = PublicationLastModifiedResolver;

let directory: string;

const post = (name: string, frontmatter: string): Promise<void> =>
    writeFile(join(directory, name), `---\n${frontmatter}\n---\n\nBody.\n`);

beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "publications-"));
});

afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
});

describe("PublicationLastModifiedResolver.resolve", () => {
    it("givenAPublication_whenReading_thenItsPathCarriesThePublicationDate", async () => {
        await post("one.md", "slug: one\npubDatetime: 2025-11-09T18:36:27Z");

        const dates: Record<string, string> = await underTest.resolve(directory);

        expect(dates).toEqual({ "/publications/one/": "2025-11-09T18:36:27Z" });
    });

    it("givenAPublicationThatChanged_whenReading_thenTheLaterDateWins", async () => {
        await post("one.md", "slug: one\npubDatetime: 2025-01-01T00:00:00Z\nmodDatetime: 2026-02-02T00:00:00Z");

        expect((await underTest.resolve(directory))["/publications/one/"]).toBe("2026-02-02T00:00:00Z");
    });

    it("givenNoSlug_whenReading_thenTheFileNameIsThePath", async () => {
        await post("from-the-file.md", "pubDatetime: 2025-01-01T00:00:00Z");

        expect(await underTest.resolve(directory)).toHaveProperty("/publications/from-the-file/");
    });

    it("givenADraft_whenReading_thenItIsLeftOut", async () => {
        await post("draft.md", "slug: draft\ndraft: true\npubDatetime: 2025-01-01T00:00:00Z");

        expect(await underTest.resolve(directory)).toEqual({});
    });

    it("givenAPublicationWithNoDate_whenReading_thenItCarriesNone", async () => {
        await post("undated.md", "slug: undated\ntitle: Undated");

        expect(await underTest.resolve(directory)).toEqual({});
    });

    it("givenAQuotedValueAndAList_whenReading_thenOnlyTheTopFieldsAreRead", async () => {
        await post("quoted.md", 'slug: "quoted"\ntags:\n  - java\n  - linux\npubDatetime: 2025-03-03T00:00:00Z');

        expect(await underTest.resolve(directory)).toEqual({
            "/publications/quoted/": "2025-03-03T00:00:00Z",
        });
    });

    it("givenAFileThatIsNotMarkdown_whenReading_thenItIsIgnored", async () => {
        await writeFile(join(directory, "notes.txt"), "not a publication");
        await post("one.md", "slug: one\npubDatetime: 2025-01-01T00:00:00Z");

        expect(Object.keys(await underTest.resolve(directory))).toEqual(["/publications/one/"]);
    });

    it("givenNoDirectory_whenReading_thenTheSitemapLosesItsDatesAndNotItsEntries", async () => {
        await expect(underTest.resolve(join(directory, "absent"))).resolves.toEqual({});
    });

    it("givenAFileWithNoFrontmatter_whenReading_thenItCarriesNoDate", async () => {
        await writeFile(join(directory, "bare.md"), "Just a body.\n");

        expect(await underTest.resolve(directory)).toEqual({});
    });

    it("givenTheDefaultDirectory_whenReading_thenTheRealPublicationsAreFound", async () => {
        const dates: Record<string, string> = await underTest.resolve();

        expect(Object.keys(dates).length).toBeGreaterThan(0);
    });
});
