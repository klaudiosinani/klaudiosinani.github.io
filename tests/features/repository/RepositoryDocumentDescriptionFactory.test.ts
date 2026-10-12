import { describe, expect, it } from "vitest";
import { RepositoryDocumentDescriptionFactory as underTest } from "@app/feature/repository/factory/RepositoryDocumentDescriptionFactory";

import type { RepositoryDocument } from "@app/feature/repository/RepositoryDocument";

const document = (
    kind: RepositoryDocument["kind"],
    title: string,
    languageName: string | null = null
): RepositoryDocument => ({
    path: "docs/readme.JP.md",
    slug: "ja",
    title,
    kind,
    language: "ja",
    languageName,
});

const of = (kind: RepositoryDocument["kind"], languageName?: string): string =>
    underTest.create(
        document(kind, "Code of conduct", languageName ?? null),
        "Taskbook",
        "Tasks, boards and notes for the terminal"
    );

describe("RepositoryDocumentDescriptionFactory.create", () => {
    it("givenATranslation_whenAsked_thenItNamesTheLanguageAndTheProject", () => {
        const description: string = of("translation", "Japanese");

        expect(description).toContain("Japanese");
        expect(description).toContain("Taskbook");
    });

    it("givenTheCodeOfConduct_whenAsked_thenItSaysWhatTheDocumentIs", () => {
        expect(of("conduct")).toContain("code of conduct");
    });

    it("givenTheWordsForAHelper_whenAsked_thenItSaysWhatAHelperCanDo", () => {
        expect(of("contributing")).toContain("pull request");
    });

    it("givenAnyOtherDocument_whenAsked_thenItNamesTheDocument", () => {
        expect(of("other")).toContain("Code of conduct for Taskbook");
    });

    it("givenAnyDocument_whenAsked_thenAResultHoldsTheWholeOfIt", () => {
        for (const kind of ["translation", "conduct", "contributing", "other"]) {
            const description: string = of(kind as RepositoryDocument["kind"], "Brazilian Portuguese");

            expect(description.length).toBeGreaterThanOrEqual(110);
            expect(description.length).toBeLessThanOrEqual(165);
        }
    });

    it("givenALogline_whenAsked_thenItOpensInLowerCaseInTheSentence", () => {
        expect(of("conduct")).toContain("Taskbook, tasks, boards and notes");
    });
});
