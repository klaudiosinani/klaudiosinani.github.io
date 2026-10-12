import { describe, expect, it } from "vitest";
import { PublicAssetResolver } from "@app/infrastructure/assets/service/PublicAssetResolver";

const underTest: PublicAssetResolver = new PublicAssetResolver();

describe("PublicAssetResolver.resolve", () => {
    it("givenAFileTheSiteServes_whenResolving_thenItsAddressIsGiven", async () => {
        expect(await underTest.resolve("/sponsors/github.png")).toBe("/sponsors/github.png");
    });

    it("givenAFileThatIsNotThere_whenResolving_thenNothingIsClaimed", async () => {
        expect(await underTest.resolve("/nothing-here.png")).toBeNull();
    });

    it("givenAnotherDirectory_whenResolving_thenItIsReadInsteadOfTheDefault", async () => {
        expect(await new PublicAssetResolver("src").resolve("/env.d.ts")).toBe("/env.d.ts");
    });
});
