import { describe, expect, it } from "vitest";
import { AUTHOR_DISCIPLINES } from "@app/configuration/author/AuthorDisciplines";
import { AUTHOR_EXPERTISE } from "@app/configuration/author/AuthorExpertise";

const underTest: readonly string[] = AUTHOR_DISCIPLINES;

const WORKS: string[] = ["publications", "books"];

const fields: string[] = underTest.flatMap((entry: string) => entry.split("&").map((part: string) => part.trim()));

describe("AUTHOR_DISCIPLINES", () => {
    it("givenEveryFieldNamed_whenRead_thenTheRecordOfThePersonStatesItToo", () => {
        const known: string[] = AUTHOR_EXPERTISE.map((field: string) => field.toLowerCase());

        for (const field of fields) {
            if (!WORKS.includes(field)) {
                expect(known, field).toContain(field);
            }
        }
    });

    it("givenEveryEntry_whenRead_thenItIsATermAndNotASentence", () => {
        for (const entry of underTest) {
            expect(entry.trim(), entry).toBe(entry);
            expect(entry.endsWith("."), entry).toBe(false);
            expect(entry.length, entry).toBeGreaterThan(2);
        }
    });

    it("givenEveryEntry_whenRead_thenItIsWrittenForTheMiddleOfASentence", () => {
        for (const entry of underTest) {
            expect(entry, entry).toBe(entry.toLowerCase());
        }
    });

    it("givenTheEntries_whenRead_thenNoneIsStatedTwice", () => {
        expect(new Set(underTest).size).toBe(underTest.length);
    });

    it("givenTheEntries_whenRead_thenTheyAreFewEnoughToReadInOnePass", () => {
        expect(underTest.length).toBeGreaterThan(0);
        expect(underTest.length).toBeLessThanOrEqual(6);
    });
});
