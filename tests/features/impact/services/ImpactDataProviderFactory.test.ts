import { describe, expect, it } from "vitest";
import { ImpactDataProviderFactory } from "@app/feature/impact/service/ImpactDataProviderFactory";
import { LiveImpactDataProvider } from "@app/feature/impact/service/LiveImpactDataProvider";
import { MockImpactDataProvider } from "@app/feature/impact/service/MockImpactDataProvider";

import type { ImpactDataProvider } from "@app/feature/impact/service/ImpactDataProvider";
const underTest: typeof ImpactDataProviderFactory = ImpactDataProviderFactory;

describe("ImpactDataProviderFactory.create", () => {
    it("givenAProductionBuild_whenCreatingAProvider_thenTheLiveProviderIsServed", () => {
        const provider: ImpactDataProvider = underTest.create(true);

        expect(provider).toBeInstanceOf(LiveImpactDataProvider);
    });

    it("givenADevelopmentBuild_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: ImpactDataProvider = underTest.create(false);

        expect(provider).toBeInstanceOf(MockImpactDataProvider);
    });

    it("givenNoExplicitEnvironment_whenCreatingAProvider_thenTheMockProviderIsServed", () => {
        const provider: ImpactDataProvider = underTest.create();

        expect(provider).toBeInstanceOf(MockImpactDataProvider);
    });
});
