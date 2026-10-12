import { describe, expect, it } from "vitest";
import { PressIconResolver } from "@app/feature/press/service/PressIconResolver";

const underTest: PressIconResolver = new PressIconResolver();

describe("PressIconResolver.resolve", () => {
    it("givenAPublisherWhoseMarkIsHeld_whenResolving_thenTheAddressOfItIsGiven", async () => {
        expect(await underTest.resolve("github.com")).toBe("/press/icons/github.com.png");
    });

    it("givenAPublisherWithNoMark_whenResolving_thenNothingIsClaimed", async () => {
        expect(await underTest.resolve("example.com")).toBeNull();
    });

    it("givenAnotherDirectory_whenResolving_thenItIsReadInsteadOfTheDefault", async () => {
        expect(await new PressIconResolver("public").resolve("favicon")).toBeNull();
    });
});
