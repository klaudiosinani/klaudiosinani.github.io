import { describe, expect, it } from "vitest";
import { MockActivityDataProvider } from "@app/feature/activity/service/MockActivityDataProvider";

import type { ActivityData } from "@app/feature/activity/service/ActivityData";
const underTest: MockActivityDataProvider = new MockActivityDataProvider();

describe("MockActivityDataProvider.provide", () => {
    it("givenThePlaceholderProvider_whenProviding_thenCommitsAndReleasesAreReturned", async () => {
        const activity: ActivityData = await underTest.provide("user");

        expect(activity.commits.length).toBeGreaterThan(0);
        expect(activity.releases.length).toBeGreaterThan(0);
    });

    it("givenAUsername_whenProviding_thenEveryUrlIsDerivedFromIt", async () => {
        const { commits, releases } = await underTest.provide("octocat");

        for (const { url } of [...commits, ...releases]) {
            expect(url).toContain("https://github.com/octocat/");
        }
    });

    it("givenThePlaceholderProvider_whenProviding_thenEveryModelFieldIsPopulated", async () => {
        const { commits, releases } = await underTest.provide("user");

        for (const commit of commits) {
            expect(commit).toEqual({
                repository: expect.any(String),
                sha: expect.any(String),
                message: expect.any(String),
                url: expect.any(String),
                committedAt: expect.any(String),
            });
        }
        for (const release of releases) {
            expect(release).toEqual({
                repository: expect.any(String),
                tag: expect.any(String),
                name: expect.any(String),
                url: expect.any(String),
                publishedAt: expect.any(String),
            });
        }
    });
});
