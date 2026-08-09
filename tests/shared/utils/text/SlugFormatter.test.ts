import { describe, expect, it } from "vitest";
import { SlugFormatter } from "@utils/text/SlugFormatter";

const underTest = SlugFormatter;

describe("SlugFormatter.format", () => {
  it.each([
    ["Singlie: v3.0.0 Release", "singlie-v-3-0-0-release"],
    [
      "Java Stream API: Insights and Misconceptions",
      "java-stream-api-insights-and-misconceptions",
    ],
    [
      "The Perpetual Struggle of Best Practices",
      "the-perpetual-struggle-of-best-practices",
    ],
    ["best-practice", "best-practice"],
    ["data-structures", "data-structures"],
    ["white-paper", "white-paper"],
    // Case boundaries
    ["camelCaseValue", "camel-case-value"],
    ["PascalCase", "pascal-case"],
    ["XMLHttpRequest", "xml-http-request"],
    ["ABCDef", "abc-def"],
    ["ABC", "abc"],
    // Letter/digit boundaries
    ["num123mix", "num-123-mix"],
    ["a1B2c3", "a-1-b-2-c-3"],
    ["HTML5 Canvas", "html-5-canvas"],
    ["v1.2.3", "v-1-2-3"],
    ["ES2015 Features", "es-2015-features"],
    // Punctuation and whitespace
    ["  spaced  out  ", "spaced-out"],
    ["with.dots.here", "with-dots-here"],
    ["foo--bar", "foo-bar"],
    ["snake_case_value", "snake-case-value"],
    ["Node.js & TypeScript", "node-js-type-script"],
    ["C++ Basics", "c-basics"],
    ["trailing-", "trailing"],
    ["-leading", "leading"],
    // Diacritics survive as base letters
    ["café-au-lait", "cafe-au-lait"],
    ["naïve approach", "naive-approach"],
    ["Ångström Unit", "angstrom-unit"],
    // Degenerate inputs
    ["", ""],
    ["  ", ""],
    ["---", ""],
  ])("given_%j_whenSlugifying_then_%j", (input, expected) => {
    // when
    const slug = underTest.format(input);

    // then
    expect(slug).toBe(expected);
  });
});

describe("SlugFormatter.formatAll", () => {
  it("givenAListOfTags_whenSlugifyingAll_thenEachIsConvertedIndependently", () => {
    // given
    const tags = ["Hello World", "camelCase"];

    // when
    const slugs = underTest.formatAll(tags);

    // then
    expect(slugs).toEqual(["hello-world", "camel-case"]);
  });

  it("givenNoTags_whenSlugifyingAll_thenAnEmptyArrayIsReturned", () => {
    // given
    const tags: string[] = [];

    // when
    const slugs = underTest.formatAll(tags);

    // then
    expect(slugs).toEqual([]);
  });
});
