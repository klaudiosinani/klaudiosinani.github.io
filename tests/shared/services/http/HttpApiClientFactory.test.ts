import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockInstance } from "vitest";
import { GitHubEndpoint } from "@app/infrastructure/github/service/GitHubEndpoint";
import type { HttpApiClient } from "@app/infrastructure/http/service/HttpApiClient";
import { HttpApiClientFactory } from "@app/infrastructure/http/factory/HttpApiClientFactory";
import { RequestHeadersFactory } from "@app/infrastructure/http/factory/RequestHeadersFactory";

const underTest: typeof HttpApiClientFactory = HttpApiClientFactory;

const answers = (): MockInstance<typeof fetch> => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    return vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
};

const addressOf = async (client: HttpApiClient, path: string): Promise<string> => {
    const fetched: MockInstance<typeof fetch> = answers();

    await client.get(path);

    return String(fetched.mock.calls[0][0]);
};

const headersOf = async (client: HttpApiClient): Promise<Record<string, string>> => {
    const fetched: MockInstance<typeof fetch> = answers();

    await client.get("anything");

    return fetched.mock.calls[0][1]?.headers as Record<string, string>;
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("HttpApiClientFactory", () => {
    it("givenTheGitHubApi_whenARequestIsMade_thenItStandsOnTheApiHost", async () => {
        await expect(addressOf(underTest.github(), "repos/owner/name")).resolves.toBe(
            "https://api.github.com/repos/owner/name"
        );
    });

    it("givenTheGitHubApi_whenARequestIsMade_thenItNamesTheVersionItSpeaks", async () => {
        await expect(headersOf(underTest.github())).resolves.toMatchObject({
            "X-GitHub-Api-Version": GitHubEndpoint.VERSION,
        });
    });

    it("givenTheGitHubWebsite_whenARequestIsMade_thenItIsTakenForABrowser", async () => {
        await expect(headersOf(underTest.githubWebsite())).resolves.toMatchObject({
            "User-Agent": "Mozilla/5.0",
        });
    });

    it("givenTheGitHubWebsite_whenARequestIsMade_thenItStandsOnTheWebsiteAndNotTheApi", async () => {
        await expect(addressOf(underTest.githubWebsite(), "owner/name/network/dependents")).resolves.toBe(
            "https://github.com/owner/name/network/dependents"
        );
    });

    it("givenTheNpmDownloads_whenARequestIsMade_thenItStandsOnTheCountsService", async () => {
        await expect(addressOf(underTest.npmDownloads(), "range/a:b/name")).resolves.toBe(
            "https://api.npmjs.org/downloads/range/a:b/name"
        );
    });

    it("givenTheNpmRegistry_whenARequestIsMade_thenItStandsOnTheRegistry", async () => {
        await expect(addressOf(underTest.npmRegistry(), "name")).resolves.toBe("https://registry.npmjs.org/name");
    });

    it("givenTheNpmRegistry_whenItDoesNotCarryAName_thenNothingIsSaidAboutIt", async () => {
        const warned: MockInstance<typeof console.warn> = vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Not Found", { status: 404 }));

        await underTest.npmRegistry().get("a-name-nobody-published");

        expect(warned).not.toHaveBeenCalled();
    });

    it("givenThePypiCounts_whenARequestIsMade_thenItStandsOnTheServiceThatHoldsThem", async () => {
        await expect(addressOf(underTest.pypiStats(), "name/recent")).resolves.toBe(
            "https://pypistats.org/api/packages/name/recent"
        );
    });

    it("givenThePypiRegistry_whenARequestIsMade_thenItStandsOnTheRegistry", async () => {
        await expect(addressOf(underTest.pypiRegistry(), "name/json")).resolves.toBe("https://pypi.org/pypi/name/json");
    });

    it("givenTheSnapStore_whenARequestIsMade_thenItNamesTheSeriesItAsksAbout", async () => {
        await expect(headersOf(underTest.snapcraft())).resolves.toMatchObject({
            "Snap-Device-Series": "16",
        });
    });

    it("givenTheSnapStore_whenARequestIsMade_thenItStandsOnTheStore", async () => {
        await expect(addressOf(underTest.snapcraft(), "info/name")).resolves.toBe(
            "https://api.snapcraft.io/v2/snaps/info/name"
        );
    });

    it("givenTheHomebrewAnalytics_whenARequestIsMade_thenItStandsOnTheFeed", async () => {
        await expect(addressOf(underTest.homebrew(), "install/homebrew-core/30d.json")).resolves.toBe(
            "https://formulae.brew.sh/api/analytics/install/homebrew-core/30d.json"
        );
    });

    it("givenAService_whenTwoReadersAskForIt_thenTheyShareTheOneClient", () => {
        expect(underTest.github()).toBe(underTest.github());
        expect(underTest.npmRegistry()).toBe(underTest.npmRegistry());
    });

    it("givenAServiceThatIsNotNamedHere_whenAClientIsAskedFor_thenItStandsWhereItWasTold", async () => {
        await expect(
            addressOf(
                underTest.custom(
                    "https://example.org/api",
                    "Example",
                    RequestHeadersFactory.fromRecord({ Accept: "text/plain" })
                ),
                "things"
            )
        ).resolves.toBe("https://example.org/api/things");
    });

    it("givenACustomClientWithHeaders_whenARequestIsMade_thenItCarriesThem", async () => {
        await expect(
            headersOf(
                underTest.custom(
                    "https://example.org/api",
                    "Example",
                    RequestHeadersFactory.fromRecord({ Accept: "text/plain" })
                )
            )
        ).resolves.toEqual({ Accept: "text/plain" });
    });
});
