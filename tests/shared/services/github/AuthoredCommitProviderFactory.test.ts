import { describe, expect, it } from "vitest";
import type { AuthoredCommitProvider } from "@app/infrastructure/github/service/AuthoredCommitProvider";
import { AuthoredCommitProviderFactory } from "@app/infrastructure/github/factory/AuthoredCommitProviderFactory";
import { GitHubAuthoredCommitProvider } from "@app/infrastructure/github/service/GitHubAuthoredCommitProvider";
import { MockAuthoredCommitProvider } from "@app/infrastructure/github/service/MockAuthoredCommitProvider";

const underTest: typeof AuthoredCommitProviderFactory = AuthoredCommitProviderFactory;

describe("AuthoredCommitProviderFactory.create", () => {
    it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
        const provider: AuthoredCommitProvider = underTest.create(true);

        expect(provider).toBeInstanceOf(GitHubAuthoredCommitProvider);
    });

    it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: AuthoredCommitProvider = underTest.create(false);

        expect(provider).toBeInstanceOf(MockAuthoredCommitProvider);
    });

    it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: AuthoredCommitProvider = underTest.create();

        expect(provider).toBeInstanceOf(MockAuthoredCommitProvider);
    });
});
