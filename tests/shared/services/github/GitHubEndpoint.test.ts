import { describe, expect, it } from "vitest";
import { GitHubEndpoint } from "@app/infrastructure/github/service/GitHubEndpoint";

const underTest: typeof GitHubEndpoint = GitHubEndpoint;

describe("GitHubEndpoint", () => {
    it("givenAPath_whenAskedForItsAddress_thenItStandsOnTheApiHost", () => {
        expect(underTest.url("repos/owner/name/readme")).toBe("https://api.github.com/repos/owner/name/readme");
    });

    it("givenAPathThatBeginsWithAStroke_whenAskedForItsAddress_thenTheStrokeIsNotDoubled", () => {
        expect(underTest.url("/users/octocat/repos")).toBe("https://api.github.com/users/octocat/repos");
    });

    it("givenTheHeader_whenRead_thenItNamesTheVersionOfTheApi", () => {
        expect(underTest.versionHeader()).toEqual({
            "X-GitHub-Api-Version": GitHubEndpoint.VERSION,
        });
    });

    it("givenTheVersion_whenRead_thenItIsADateGitHubPublished", () => {
        expect(GitHubEndpoint.VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
