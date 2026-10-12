import { describe, expect, it } from "vitest";
import { PAGE_DESCRIPTIONS } from "@app/configuration/PageDescriptions";
import type { PageKey } from "@app/configuration/PageKey";

const underTest: Readonly<Record<PageKey, string>> = PAGE_DESCRIPTIONS;

const entries: [string, string][] = Object.entries(underTest);

describe("PAGE_DESCRIPTIONS", () => {
    it("givenEveryDescription_whenMeasured_thenItFillsTheSpaceASearchEngineGives", () => {
        for (const [page, description] of entries) {
            expect(description.length, page).toBeGreaterThanOrEqual(120);
            expect(description.length, page).toBeLessThanOrEqual(160);
        }
    });

    it("givenEveryDescription_whenCompared_thenNoTwoPagesShareOne", () => {
        const texts: string[] = entries.map(([, description]: [string, string]) => description);

        expect(new Set(texts).size).toBe(texts.length);
    });

    it("givenEveryDescription_whenRead_thenItIsASentence", () => {
        for (const [page, description] of entries) {
            expect(description.endsWith("."), page).toBe(true);
        }
    });
});
