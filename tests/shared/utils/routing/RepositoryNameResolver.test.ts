import { describe, expect, it } from "vitest";
import { RepositoryNameResolver } from "@app/util/routing/RepositoryNameResolver";

const underTest: typeof RepositoryNameResolver = RepositoryNameResolver;

describe("RepositoryNameResolver.resolve", () => {
    it("givenTheAddressOfARepository_whenResolving_thenTheNameIsTaken", () => {
        expect(underTest.resolve("https://github.com/klaudiosinani/taskbook")).toBe("taskbook");
    });

    it("givenAnAddressThatEndsWithASeparator_whenResolving_thenTheNameIsStillTaken", () => {
        expect(underTest.resolve("https://github.com/klaudiosinani/signale/")).toBe("signale");
    });

    it("givenANameInCapitals_whenResolving_thenItIsLowercased", () => {
        expect(underTest.resolve("https://github.com/klaudiosinani/Tusk")).toBe("tusk");
    });
});
