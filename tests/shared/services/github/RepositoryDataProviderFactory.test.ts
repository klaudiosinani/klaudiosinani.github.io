import { describe, expect, it } from "vitest";
import { GitHubRepositoryDataProvider } from "@app/infrastructure/github/service/GitHubRepositoryDataProvider";
import { MockRepositoryDataProvider } from "@app/infrastructure/github/service/MockRepositoryDataProvider";
import { RepositoryDataProviderFactory } from "@app/infrastructure/github/factory/RepositoryDataProviderFactory";
import type { RepositoryDataProvider } from "@app/infrastructure/github/service/RepositoryDataProvider";

const underTest: typeof RepositoryDataProviderFactory = RepositoryDataProviderFactory;

describe("RepositoryDataProviderFactory.create", () => {
    it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
        const isProduction: boolean = true;

        const provider: RepositoryDataProvider = underTest.create(isProduction);

        expect(provider).toBeInstanceOf(GitHubRepositoryDataProvider);
    });

    it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const isProduction: boolean = false;

        const provider: RepositoryDataProvider = underTest.create(isProduction);

        expect(provider).toBeInstanceOf(MockRepositoryDataProvider);
    });

    it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: RepositoryDataProvider = underTest.create();

        expect(provider).toBeInstanceOf(MockRepositoryDataProvider);
    });
});
