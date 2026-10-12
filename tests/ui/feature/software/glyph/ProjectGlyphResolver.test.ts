import { describe, expect, it } from "vitest";
import { ChecklistGlyph } from "@ui/component/icon/glyph/ChecklistGlyph";
import { GraphGlyph } from "@ui/component/icon/glyph/GraphGlyph";
import { LambdaGlyph } from "@ui/component/icon/glyph/LambdaGlyph";
import { LogGlyph } from "@ui/component/icon/glyph/LogGlyph";
import { ProjectGlyphResolver } from "@ui/feature/software/glyph/ProjectGlyphResolver";

describe("ProjectGlyphResolver", () => {
    const projectGlyphResolver: ProjectGlyphResolver = new ProjectGlyphResolver();

    it("givenAKnownProject_whenResolving_thenItsOwnGlyphComes", () => {
        expect(projectGlyphResolver.resolve("signale")).toBe(LogGlyph);
        expect(projectGlyphResolver.resolve("taskbook")).toBe(ChecklistGlyph);
        expect(projectGlyphResolver.resolve("arare")).toBe(LambdaGlyph);
    });

    it("givenANameInCapitals_whenResolving_thenTheGlyphStillComes", () => {
        expect(projectGlyphResolver.resolve("Signale")).toBe(LogGlyph);
    });

    it("givenAnUnknownProject_whenResolving_thenTheGraphGlyphComes", () => {
        expect(projectGlyphResolver.resolve("binstree")).toBe(GraphGlyph);
    });
});
