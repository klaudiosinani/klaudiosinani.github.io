import { describe, expect, it } from "vitest";
import { MARKDOWN_STYLING } from "@app/configuration/MarkdownStyling";
import type { MarkdownStyling } from "@app/configuration/MarkdownStyling";

const underTest: MarkdownStyling = MARKDOWN_STYLING;

describe("MARKDOWN_STYLING", () => {
    it("givenTheTwoThemesOfTheSite_whenReading_thenBothAreNamed", () => {
        expect(underTest.themes.light.length).toBeGreaterThan(0);
        expect(underTest.themes.dark.length).toBeGreaterThan(0);
        expect(underTest.themes.light).not.toBe(underTest.themes.dark);
    });

    it("givenALongLineOfCode_whenHighlighting_thenItWrapsRatherThanScrolls", () => {
        expect(underTest.wrap).toBe(true);
    });
});
