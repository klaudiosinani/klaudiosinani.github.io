import { describe, expect, it } from "vitest";
import { SlugFormatter } from "@app/util/text/SlugFormatter";

const underTest: typeof SlugFormatter = SlugFormatter;

describe("SlugFormatter.format", () => {
    it.each([
        ["Singlie: v3.0.0 Release", "singlie-v-3-0-0-release"],
        ["Java Stream API: Insights and Misconceptions", "java-stream-api-insights-and-misconceptions"],
        ["The Perpetual Struggle of Best Practices", "the-perpetual-struggle-of-best-practices"],
        ["best-practice", "best-practice"],
        ["data-structures", "data-structures"],
        ["white-paper", "white-paper"],
        ["camelCaseValue", "camel-case-value"],
        ["PascalCase", "pascal-case"],
        ["XMLHttpRequest", "xml-http-request"],
        ["ABCDef", "abc-def"],
        ["ABC", "abc"],
        ["num123mix", "num-123-mix"],
        ["a1B2c3", "a-1-b-2-c-3"],
        ["HTML5 Canvas", "html-5-canvas"],
        ["v1.2.3", "v-1-2-3"],
        ["ES2015 Features", "es-2015-features"],
        ["  spaced  out  ", "spaced-out"],
        ["with.dots.here", "with-dots-here"],
        ["foo--bar", "foo-bar"],
        ["snake_case_value", "snake-case-value"],
        ["Node.js & TypeScript", "node-js-type-script"],
        ["C++ Basics", "c-basics"],
        ["trailing-", "trailing"],
        ["-leading", "leading"],
        ["café-au-lait", "cafe-au-lait"],
        ["naïve approach", "naive-approach"],
        ["Ångström Unit", "angstrom-unit"],
        ["", ""],
        ["  ", ""],
        ["---", ""],
    ])("given_%j_whenSlugifying_then_%j", (input: string, expected: string) => {
        const slug: string = underTest.format(input);

        expect(slug).toBe(expected);
    });
});

describe("SlugFormatter.formatAll", () => {
    it("givenAListOfTags_whenSlugifyingAll_thenEachIsConvertedIndependently", () => {
        const tags: string[] = ["Hello World", "camelCase"];

        const slugs: string[] = underTest.formatAll(tags);

        expect(slugs).toEqual(["hello-world", "camel-case"]);
    });

    it("givenNoTags_whenSlugifyingAll_thenAnEmptyArrayIsReturned", () => {
        const tags: string[] = [];

        const slugs: string[] = underTest.formatAll(tags);

        expect(slugs).toEqual([]);
    });
});
