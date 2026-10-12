import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { AuthorPortraitResolver } from "@app/infrastructure/assets/service/AuthorPortraitResolver";
import { PublicAssetResolver } from "@app/infrastructure/assets/service/PublicAssetResolver";

const holding = (...held: string[]): PublicAssetResolver => {
    const resolve: Mock = vi.fn((path: string) => Promise.resolve(held.includes(path) ? path : null));

    return { resolve } as unknown as PublicAssetResolver;
};

describe("AuthorPortraitResolver.resolve", () => {
    it("givenTheBuildWroteAJpeg_whenResolving_thenThatFileIsDrawn", async () => {
        const underTest: AuthorPortraitResolver = new AuthorPortraitResolver(holding("/portrait.jpg"));

        await expect(underTest.resolve()).resolves.toBe("/portrait.jpg");
    });

    it("givenTheBuildWroteAPng_whenResolving_thenTheLaterEndingIsFound", async () => {
        const underTest: AuthorPortraitResolver = new AuthorPortraitResolver(holding("/portrait.png"));

        await expect(underTest.resolve()).resolves.toBe("/portrait.png");
    });

    it("givenNoPictureWasRead_whenResolving_thenThePageStatesNone", async () => {
        const underTest: AuthorPortraitResolver = new AuthorPortraitResolver(holding());

        await expect(underTest.resolve()).resolves.toBeNull();
    });
});
