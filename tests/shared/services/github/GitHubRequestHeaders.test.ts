import { afterEach, describe, expect, it, vi } from "vitest";
import { GitHubEndpoint } from "@app/infrastructure/github/service/GitHubEndpoint";
import { GitHubRequestHeaders } from "@app/infrastructure/github/service/GitHubRequestHeaders";

const underTest: typeof GitHubRequestHeaders = GitHubRequestHeaders;

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("GitHubRequestHeaders.headers", () => {
    it("givenNoToken_whenAsked_thenTheVersionAloneIsNamed", () => {
        vi.stubEnv("GITHUB_TOKEN", "");
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "");

        expect(underTest.headers()).toEqual({
            "X-GitHub-Api-Version": GitHubEndpoint.VERSION,
        });
    });

    it("givenAToken_whenAsked_thenTheRequestIsAuthenticated", () => {
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "");
        vi.stubEnv("GITHUB_TOKEN", "a-token");

        expect(underTest.headers().Authorization).toBe("Bearer a-token");
    });

    it("givenBothTokens_whenAsked_thenTheTrafficTokenIsTheOneUsed", () => {
        vi.stubEnv("GITHUB_TOKEN", "a-token");
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "a-traffic-token");

        expect(underTest.headers().Authorization).toBe("Bearer a-traffic-token");
    });

    it("givenTheTokenIsStatedAfterTheClientIsBuilt_whenAsked_thenItIsStillUsed", () => {
        vi.stubEnv("GITHUB_TOKEN", "");
        vi.stubEnv("GITHUB_TRAFFIC_TOKEN", "");
        expect(underTest.headers().Authorization).toBeUndefined();

        vi.stubEnv("GITHUB_TOKEN", "a-later-token");

        expect(underTest.headers().Authorization).toBe("Bearer a-later-token");
    });
});

describe("GitHubRequestHeaders.raw", () => {
    it("givenADocument_whenAskedForItAsItStands_thenTheAnswerIsNotJson", () => {
        expect(GitHubRequestHeaders.raw()).toEqual({
            Accept: "application/vnd.github.raw",
        });
    });
});
