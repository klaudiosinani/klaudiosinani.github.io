import { describe, expect, it } from "vitest";
import { MockRepositoryDataProvider } from "@app/infrastructure/github/service/MockRepositoryDataProvider";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";

const underTest: MockRepositoryDataProvider = new MockRepositoryDataProvider();

describe("MockRepositoryDataProvider.provide", () => {
    it("givenThePlaceholderProvider_whenFetchingRepositories_thenTheListingIsNotEmpty", async () => {
        const repositories: RepositoryData[] = await underTest.provide("user");

        expect(repositories.length).toBeGreaterThan(0);
    });

    it("givenAUsername_whenFetchingRepositories_thenEveryUrlIsDerivedFromIt", async () => {
        const repositories: RepositoryData[] = await underTest.provide("octocat");

        for (const { name, url } of repositories) {
            expect(url).toBe(`https://github.com/octocat/${name}`);
        }
    });

    it("givenThePlaceholderProvider_whenFetchingRepositories_thenEveryModelFieldIsPopulated", async () => {
        const repositories: RepositoryData[] = await underTest.provide("user");

        for (const repository of repositories) {
            expect(repository).toEqual({
                name: expect.any(String),
                description: expect.any(String),
                url: expect.any(String),
                stars: expect.any(Number),
                forks: expect.any(Number),
                language: expect.any(String),
                license: expect.any(String),
                topics: expect.any(Array),
                createdAt: expect.any(String),
                latestUpdate: expect.any(String),
                latestPush: expect.any(String),
            });
        }
    });
});
