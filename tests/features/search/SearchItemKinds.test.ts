import { describe, expect, it } from "vitest";
import { SearchItemKinds } from "@app/feature/search/SearchItemKinds";

const underTest: typeof SearchItemKinds = SearchItemKinds;

describe("SearchItemKinds.name", () => {
    it("givenEachKind_whenNaming_thenAReaderReadsWhatItIs", () => {
        expect(underTest.name("publication")).toBe("Publication");
        expect(underTest.name("software")).toBe("Software");
        expect(underTest.name("press")).toBe("Press");
    });
});

describe("SearchItemKinds.plural", () => {
    it("givenSeveralOfOneKind_whenNaming_thenTheControlReadsAsARow", () => {
        expect(underTest.plural("publication")).toBe("Publications");
        expect(underTest.plural("software")).toBe("Software");
        expect(underTest.plural("press")).toBe("Press");
    });
});

describe("SearchItemKinds.ALL", () => {
    it("givenTheKinds_whenRead_thenTheSoftwareStandsFirst", () => {
        expect(underTest.ALL[0]).toBe("software");
    });

    it("givenTheKinds_whenRead_thenEveryOneIsNamed", () => {
        for (const kind of underTest.ALL) {
            expect(underTest.name(kind).length).toBeGreaterThan(0);
            expect(underTest.plural(kind).length).toBeGreaterThan(0);
        }

        expect(underTest.ALL).toHaveLength(3);
    });
});
