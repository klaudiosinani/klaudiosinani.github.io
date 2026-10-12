import { describe, expect, it } from "vitest";
import { WebAddressFormatter } from "@app/util/text/WebAddressFormatter";

const underTest: typeof WebAddressFormatter = WebAddressFormatter;

describe("WebAddressFormatter.host", () => {
    it("givenAnAddress_whenFormatting_thenOnlyTheHostIsKept", () => {
        expect(underTest.host("https://betterstack.com/community/guides/logging/")).toBe("betterstack.com");
    });

    it("givenAHostThatStartsWithWww_whenFormatting_thenThatPrefixIsRemoved", () => {
        expect(underTest.host("https://www.omgubuntu.co.uk/2017/08/tusk")).toBe("omgubuntu.co.uk");
    });

    it("givenAnAddressWithNoSecureScheme_whenFormatting_thenTheHostIsStillKept", () => {
        expect(underTest.host("http://www.linux-magazine.com/Issues/2019")).toBe("linux-magazine.com");
    });
});
