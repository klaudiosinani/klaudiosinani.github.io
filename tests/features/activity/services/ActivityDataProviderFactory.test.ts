import { describe, expect, it } from "vitest";
import { ActivityDataProviderFactory } from "@app/feature/activity/service/ActivityDataProviderFactory";
import { GitHubActivityDataProvider } from "@app/feature/activity/service/GitHubActivityDataProvider";
import { MockActivityDataProvider } from "@app/feature/activity/service/MockActivityDataProvider";

import type { ActivityDataProvider } from "@app/feature/activity/service/ActivityDataProvider";
const underTest: typeof ActivityDataProviderFactory = ActivityDataProviderFactory;

describe("ActivityDataProviderFactory.create", () => {
    it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
        const provider: ActivityDataProvider = underTest.create(true);

        expect(provider).toBeInstanceOf(GitHubActivityDataProvider);
    });

    it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: ActivityDataProvider = underTest.create(false);

        expect(provider).toBeInstanceOf(MockActivityDataProvider);
    });

    it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: ActivityDataProvider = underTest.create();

        expect(provider).toBeInstanceOf(MockActivityDataProvider);
    });
});
