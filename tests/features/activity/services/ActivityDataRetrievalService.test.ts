import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { ActivityDataRetrievalService } from "@app/feature/activity/service/ActivityDataRetrievalService";
import type { ActivityData } from "@app/feature/activity/service/ActivityData";
import type { ActivityDataProvider } from "@app/feature/activity/service/ActivityDataProvider";
import { GITHUB_USERNAME } from "@app/configuration/GitHubUsername";

const activity: ActivityData = { commits: [], releases: [] };

describe("ActivityDataRetrievalService.retrieve", () => {
    it("givenNoExplicitUsername_whenRetrieving_thenTheConfiguredAccountIsUsed", async () => {
        const provide: Mock<ActivityDataProvider["provide"]> = vi.fn().mockResolvedValue(activity);
        const provider: ActivityDataProvider = { provide };
        const underTest: ActivityDataRetrievalService = new ActivityDataRetrievalService(undefined, provider);

        const retrieved: ActivityData = await underTest.retrieve();

        expect(retrieved).toEqual(activity);
        expect(provide).toHaveBeenCalledExactlyOnceWith(GITHUB_USERNAME);
    });

    it("givenACustomUsername_whenRetrieving_thenItOverridesTheDefault", async () => {
        const provide: Mock<ActivityDataProvider["provide"]> = vi.fn().mockResolvedValue(activity);
        const underTest: ActivityDataRetrievalService = new ActivityDataRetrievalService("octocat", { provide });

        await underTest.retrieve();

        expect(provide).toHaveBeenCalledExactlyOnceWith("octocat");
    });

    it("givenSeveralCallers_whenRetrieving_thenOneRequestIsShared", async () => {
        const provide: Mock<ActivityDataProvider["provide"]> = vi.fn().mockResolvedValue(activity);
        const underTest: ActivityDataRetrievalService = new ActivityDataRetrievalService("user", { provide });

        await Promise.all([underTest.retrieve(), underTest.retrieve()]);
        await underTest.retrieve();

        expect(provide).toHaveBeenCalledTimes(1);
    });

    it("givenAFailedRequest_whenRetrievingAgain_thenTheRetrySucceeds", async () => {
        const provide: Mock<ActivityDataProvider["provide"]> = vi
            .fn()
            .mockRejectedValueOnce(new Error("GitHub API error"))
            .mockResolvedValueOnce(activity);
        const underTest: ActivityDataRetrievalService = new ActivityDataRetrievalService("user", { provide });

        await expect(underTest.retrieve()).rejects.toThrow("GitHub API error");
        await expect(underTest.retrieve()).resolves.toEqual(activity);
        expect(provide).toHaveBeenCalledTimes(2);
    });
});

describe("ActivityDataRetrievalService.shared", () => {
    it("givenSeveralPages_whenAskingForTheSharedService_thenOneInstanceServesThemAll", () => {
        const first: ActivityDataRetrievalService = ActivityDataRetrievalService.shared();
        const second: ActivityDataRetrievalService = ActivityDataRetrievalService.shared();

        expect(first).toBe(second);
        expect(first).toBeInstanceOf(ActivityDataRetrievalService);
    });
});
