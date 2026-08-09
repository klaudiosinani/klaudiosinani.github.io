import { describe, expect, it } from "vitest";
import { TitleFormatter } from "@utils/text/TitleFormatter";

const underTest = TitleFormatter;

describe("TitleFormatter.format", () => {
  it.each([
    ["taskbook", "Taskbook"],
    ["ulauncher-theme-synchronizer", "Ulauncher Theme Synchronizer"],
    ["a", "A"],
    ["already Capitalized", "Already Capitalized"],
    ["", ""],
  ])("given_%j_whenFormattingTheTitle_then_%j", (input, expected) => {
    // when
    const title = underTest.format(input);

    // then
    expect(title).toBe(expected);
  });
});
