import { afterEach, describe, expect, it, vi } from "vitest";
import { GitHubReleasesProvider } from "@app/feature/impact/service/github/GitHubReleasesProvider";

import type { ReleaseTotals } from "@app/feature/impact/service/github/ReleaseTotals";
const underTest: GitHubReleasesProvider = new GitHubReleasesProvider();

const jsonResponse = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

describe("GitHubReleasesProvider.releases", () => {
    it("givenReleases_whenGathering_thenAssetsAndDatesComeFromOnePass", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(
                jsonResponse([
                    {
                        published_at: "2026-08-01T00:00:00Z",
                        assets: [{ download_count: 100 }, { download_count: 5 }],
                    },
                    { published_at: "2020-01-01T00:00:00Z", assets: [] },
                ])
            )
        );

        const totals: ReleaseTotals = await underTest.releases("user", ["one", "two"]);

        expect(totals.downloads).toBe(210);
        expect(totals.publishedAt).toHaveLength(4);
    });

    it("givenADraftRelease_whenGathering_thenItHasNoPublicationDate", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() =>
            Promise.resolve(jsonResponse([{ published_at: null, assets: [] }]))
        );

        const totals: ReleaseTotals = await underTest.releases("user", ["one"]);

        expect(totals.publishedAt).toEqual([]);
    });

    it("givenAFailingApi_whenGathering_thenNothingIsCounted", async () => {
        vi.spyOn(globalThis, "fetch").mockImplementation(() => Promise.resolve(new Response("nope", { status: 403 })));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ReleaseTotals = await underTest.releases("user", ["one"]);

        expect(totals).toEqual({ downloads: 0, publishedAt: [] });
    });

    it("givenAnUnreachableApi_whenGathering_thenNothingIsCounted", async () => {
        vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
        vi.spyOn(console, "warn").mockImplementation(() => {});

        const totals: ReleaseTotals = await underTest.releases("user", ["one"]);

        expect(totals.downloads).toBe(0);
    });
});
