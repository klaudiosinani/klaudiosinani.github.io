import { describe, expect, it } from "vitest";
import { LiveRepositoryProfileProvider } from "@app/feature/repository/service/LiveRepositoryProfileProvider";
import { MockRepositoryProfileProvider } from "@app/feature/repository/service/MockRepositoryProfileProvider";
import { RepositoryProfileProviderFactory } from "@app/feature/repository/service/RepositoryProfileProviderFactory";

import type { RepositoryProfileProvider } from "@app/feature/repository/service/RepositoryProfileProvider";
const underTest: typeof RepositoryProfileProviderFactory = RepositoryProfileProviderFactory;

describe("RepositoryProfileProviderFactory.create", () => {
    it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
        const provider: RepositoryProfileProvider = underTest.create(true);

        expect(provider).toBeInstanceOf(LiveRepositoryProfileProvider);
    });

    it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: RepositoryProfileProvider = underTest.create(false);

        expect(provider).toBeInstanceOf(MockRepositoryProfileProvider);
    });

    it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: RepositoryProfileProvider = underTest.create();

        expect(provider).toBeInstanceOf(MockRepositoryProfileProvider);
    });
});
