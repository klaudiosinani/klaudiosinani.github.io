import { describe, expect, it } from "vitest";
import { MockRepositoryDataProvider } from "@services/github/MockRepositoryDataProvider";

const underTest = new MockRepositoryDataProvider();

describe("MockRepositoryDataProvider.provide", () => {
  it("givenThePlaceholderProvider_whenFetchingRepositories_thenTheListingIsNotEmpty", async () => {
    // given

    // when
    const repositories = await underTest.provide("user");

    // then
    expect(repositories.length).toBeGreaterThan(0);
  });

  it("givenAUsername_whenFetchingRepositories_thenEveryUrlIsDerivedFromIt", async () => {
    // given

    // when
    const repositories = await underTest.provide("octocat");

    // then
    for (const { name, url } of repositories) {
      expect(url).toBe(`https://github.com/octocat/${name}`);
    }
  });

  it("givenThePlaceholderProvider_whenFetchingRepositories_thenEveryModelFieldIsPopulated", async () => {
    // given

    // when
    const repositories = await underTest.provide("user");

    // then
    for (const repository of repositories) {
      expect(repository).toEqual({
        name: expect.any(String),
        description: expect.any(String),
        url: expect.any(String),
        stars: expect.any(Number),
        forks: expect.any(Number),
        language: expect.any(String),
        latestUpdate: expect.any(String),
      });
    }
  });
});
