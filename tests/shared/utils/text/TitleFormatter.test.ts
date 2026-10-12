import { describe, expect, it } from "vitest";
import { TitleFormatter } from "@app/util/text/TitleFormatter";

const underTest: typeof TitleFormatter = TitleFormatter;

describe("TitleFormatter.format", () => {
    it.each([
        ["taskbook", "Taskbook"],
        ["ulauncher-theme-synchronizer", "Ulauncher Theme Synchronizer"],
        ["a", "A"],
        ["already Capitalized", "Already Capitalized"],
        ["", ""],
    ])("given_%j_whenFormattingTheTitle_then_%j", (input: string, expected: string) => {
        const title: string = underTest.format(input);

        expect(title).toBe(expected);
    });
});
