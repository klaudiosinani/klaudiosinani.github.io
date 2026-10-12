import { describe, expect, it } from "vitest";
import type { KeyboardRoute } from "@app/configuration/KeyboardRoutes";
import { KEYBOARD_ROUTES } from "@app/configuration/KeyboardRoutes";

const underTest: readonly KeyboardRoute[] = KEYBOARD_ROUTES;

describe("KEYBOARD_ROUTES", () => {
    it("givenTheSequences_whenRead_thenNoTwoUseTheSameKey", () => {
        const keys: string[] = underTest.map(({ key }: KeyboardRoute) => key);

        expect(new Set(keys).size).toBe(keys.length);
    });

    it("givenEachSequence_whenRead_thenItOpensAPageOfThisSite", () => {
        for (const { label, href } of underTest) {
            expect(href, label).toMatch(/^\//);
        }
    });

    it("givenTheSequences_whenRead_thenEachOneIsASingleLetter", () => {
        for (const { key, label } of underTest) {
            expect(key, label).toMatch(/^[a-z]$/);
        }
    });
});
