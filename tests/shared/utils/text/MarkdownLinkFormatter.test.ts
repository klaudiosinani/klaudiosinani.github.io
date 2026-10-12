import { describe, expect, it } from "vitest";
import { MarkdownLinkFormatter } from "@app/util/text/MarkdownLinkFormatter";
import { SITE } from "@app/configuration/Site";

const underTest: typeof MarkdownLinkFormatter = MarkdownLinkFormatter;

describe("MarkdownLinkFormatter.entry", () => {
    it("givenAPageOfThisSite_whenWritten_thenItStatesTheWholeAddress", () => {
        const written: string = underTest.entry("Software", "/software/", "The open source work.");

        expect(written).toBe(`- [Software](${new URL("/software/", SITE.website).href}): The open source work.`);
    });

    it("givenAnAddressAlreadyWhole_whenWritten_thenItIsKeptAsItStands", () => {
        expect(underTest.entry("GitHub", "https://github.com/user", "The account.")).toBe(
            "- [GitHub](https://github.com/user): The account."
        );
    });
});
