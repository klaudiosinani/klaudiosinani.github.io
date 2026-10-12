import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubEndpoint } from "@app/infrastructure/github/service/GitHubEndpoint";
import { RepositoryLastModifiedResolver } from "@app/infrastructure/sitemap/service/RepositoryLastModifiedResolver";

const underTest: typeof RepositoryLastModifiedResolver = RepositoryLastModifiedResolver;

const building = (): void => {
    vi.stubGlobal("process", { ...process, argv: ["node", "astro", "build"] });
};

const listing = (repositories: { name: string; pushed_at?: string | null }[]): Response =>
    new Response(
        JSON.stringify(
            repositories.map(({ name, pushed_at: pushed }: { name: string; pushed_at?: string | null }) => ({
                name,
                pushed_at: pushed === undefined ? "2026-08-10T16:20:00Z" : pushed,
            }))
        ),
        { status: 200 }
    );

beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    building();
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

describe("RepositoryLastModifiedResolver.resolve", () => {
    it("givenARepository_whenResolving_thenItsPageCarriesTheDateOfItsLastCommit", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(listing([{ name: "qoa" }]));

        await expect(underTest.resolve("user")).resolves.toEqual({
            "/qoa/": "2026-08-10T16:20:00Z",
            "/qoa/documentation/": "2026-08-10T16:20:00Z",
            "/qoa/releases/": "2026-08-10T16:20:00Z",
        });
    });

    it("givenARepositoryNamedAfterARoute_whenResolving_thenItIsLeftOut", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(listing([{ name: "about" }, { name: "qoa" }]));

        const dates: Record<string, string> = await underTest.resolve("user");

        expect(Object.keys(dates)).toEqual(["/qoa/", "/qoa/documentation/", "/qoa/releases/"]);
    });

    it("givenARepositoryWithNoRecordedPush_whenResolving_thenNoDateIsClaimed", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(listing([{ name: "empty", pushed_at: null }]));

        await expect(underTest.resolve("user")).resolves.toEqual({});
    });

    it("givenACommandThatIsNotABuild_whenResolving_thenNothingIsRequested", async () => {
        vi.stubGlobal("process", { ...process, argv: ["node", "astro", "dev"] });
        const fetchSpy: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch");

        await expect(underTest.resolve("user")).resolves.toEqual({});
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("givenAnExportedToken_whenListing_thenTheRequestIsAuthenticated", async () => {
        vi.stubEnv("GITHUB_TOKEN", "secret");
        const fetchSpy: MockInstance<typeof fetch> = vi.spyOn(globalThis, "fetch").mockResolvedValue(listing([]));

        await underTest.resolve("user");

        expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(expect.any(String), {
            headers: {
                Authorization: "Bearer secret",
                "X-GitHub-Api-Version": GitHubEndpoint.VERSION,
            },
        });
    });

    it("givenTheSitemap_whenListing_thenItReadsTheApiTheRestOfTheBuildReads", () => {
        expect(GitHubEndpoint.url("users/user/repos")).toContain("https://api.github.com/");
    });

    it("givenARefusedListing_whenResolving_thenTheSitemapShipsWithoutDates", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 403, statusText: "Forbidden" }));

        await expect(underTest.resolve("user")).resolves.toEqual({});
    });
});
