import { describe, expect, it, vi } from "vitest";
import type { ImpactData } from "@app/feature/impact/ImpactData";
import type { ImpactDataProvider } from "@app/feature/impact/service/ImpactDataProvider";
import { ActivityDatasetRetrievalService } from "@app/feature/impact/service/ActivityDatasetRetrievalService.ts";

const data: ImpactData = {} as ImpactData;

const provider = (impl: () => Promise<ImpactData>): ImpactDataProvider => ({
    provide: vi.fn(impl),
});

describe("ImpactDataRetrievalService.retrieve", () => {
    it("givenRepeatedCalls_whenRetrieving_thenTheGatherIsSharedAcrossTheBuild", async () => {
        const source: ImpactDataProvider = provider(() => Promise.resolve(data));
        const underTest: ActivityDatasetRetrievalService = new ActivityDatasetRetrievalService("user", source);

        await Promise.all([underTest.retrieve(), underTest.retrieve()]);

        expect(source.provide).toHaveBeenCalledTimes(1);
        expect(source.provide).toHaveBeenCalledWith("user");
    });

    it("givenAFailedGather_whenRetryingLater_thenTheRejectionIsNotCached", async () => {
        let attempts: number = 0;
        const source: ImpactDataProvider = provider(() => {
            attempts += 1;

            return attempts === 1 ? Promise.reject(new Error("offline")) : Promise.resolve(data);
        });
        const underTest: ActivityDatasetRetrievalService = new ActivityDatasetRetrievalService("user", source);

        await expect(underTest.retrieve()).rejects.toThrow("offline");

        await expect(underTest.retrieve()).resolves.toBe(data);
        expect(attempts).toBe(2);
    });

    it("givenNoExplicitUsername_whenConstructed_thenTheConfiguredAccountIsUsed", async () => {
        const source: ImpactDataProvider = provider(() => Promise.resolve(data));
        const underTest: ActivityDatasetRetrievalService = new ActivityDatasetRetrievalService(undefined, source);

        await underTest.retrieve();

        expect(source.provide).toHaveBeenCalledWith("klaudiosinani");
    });

    it("givenNoInjectedProvider_whenConstructed_thenTheFactorySuppliesOne", () => {
        const underTest: ActivityDatasetRetrievalService = new ActivityDatasetRetrievalService();

        expect(underTest).toBeInstanceOf(ActivityDatasetRetrievalService);
    });
});

describe("ImpactDataRetrievalService.shared", () => {
    it("givenSeveralPages_whenAskingForTheSharedService_thenOneInstanceServesThemAll", () => {
        const first: ActivityDatasetRetrievalService = ActivityDatasetRetrievalService.shared();
        const second: ActivityDatasetRetrievalService = ActivityDatasetRetrievalService.shared();

        expect(first).toBe(second);
        expect(first).toBeInstanceOf(ActivityDatasetRetrievalService);
    });
});
