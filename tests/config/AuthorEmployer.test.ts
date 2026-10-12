import { describe, expect, it } from "vitest";
import { AUTHOR_EMPLOYER } from "@app/configuration/AuthorEmployer";
import type { AuthorEmployer } from "@app/configuration/AuthorEmployer";

const underTest: AuthorEmployer = AUTHOR_EMPLOYER;

describe("AUTHOR_EMPLOYER", () => {
    it("givenTheEmployer_whenRead_thenItIsNamed", () => {
        expect(underTest.name.trim()).toBe(underTest.name);
        expect(underTest.name.length).toBeGreaterThan(1);
    });

    it("givenTheEmployer_whenRead_thenItsAddressIsOneASearchEngineCanFollow", () => {
        expect(() => new URL(underTest.url)).not.toThrow();
        expect(underTest.url.startsWith("https://")).toBe(true);
    });
});
