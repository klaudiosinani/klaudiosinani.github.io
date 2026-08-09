import { describe, expect, it } from "vitest";
import { GitHubRepositoryDataProvider } from "@services/github/GitHubRepositoryDataProvider";
import { MockRepositoryDataProvider } from "@services/github/MockRepositoryDataProvider";
import { RepositoryDataProviderFactory } from "@services/github/RepositoryDataProviderFactory";

const underTest = RepositoryDataProviderFactory;

describe("RepositoryDataProviderFactory.create", () => {
  it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
    // given
    const isProduction = true;

    // when
    const provider = underTest.create(isProduction);

    // then
    expect(provider).toBeInstanceOf(GitHubRepositoryDataProvider);
  });

  it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
    // given
    const isProduction = false;

    // when
    const provider = underTest.create(isProduction);

    // then
    expect(provider).toBeInstanceOf(MockRepositoryDataProvider);
  });

  it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
    // import.meta.env.PROD is false under vitest
    // when
    const provider = underTest.create();

    // then
    expect(provider).toBeInstanceOf(MockRepositoryDataProvider);
  });
});
