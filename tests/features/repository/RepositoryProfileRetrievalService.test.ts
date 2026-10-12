import { describe, expect, it, vi } from "vitest";
import { RepositoryRef } from "@app/infrastructure/github/domain/RepositoryRef";
import type { Mock } from "vitest";
import { RepositoryProfileRetrievalService } from "@app/feature/repository/service/RepositoryProfileRetrievalService";
import type { RepositoryProfile } from "@app/feature/repository/RepositoryProfile";
import type { RepositoryProfileProvider } from "@app/feature/repository/service/RepositoryProfileProvider";

const profile = (slug: string): RepositoryProfile => ({
    slug,
    name: slug,
    logline: "",
    description: "",
    url: `https://github.com/klaudiosinani/${slug}`,
    language: null,
    license: "MIT",
    topics: [],
    createdAt: "2017-10-01T00:00:00Z",
    stars: 0,
    forks: 0,
    downloads: { total: null, sources: [], caveats: [] },
    trend: [],
    starHistory: [],
    releases: [],
    totals: {
        commits: 128,
        openIssues: 0,
        closedIssues: 0,
        openPullRequests: 0,
        mergedPullRequests: 0,
    },
    packages: [],
    latestCommit: null,
    languages: [],
    contributors: null,
    clones: null,
    dependents: null,
    manual: null,
    documents: [],
    citation: null,
});

const providerOf = (implementation: RepositoryProfileProvider["provide"]): RepositoryProfileProvider => ({
    provide: implementation,
});

describe("RepositoryProfileRetrievalService.retrieve", () => {
    it("givenTheSameSlugTwice_whenRetrieving_thenTheGatherIsSharedRatherThanRepeated", async () => {
        const provide: Mock<(repository: RepositoryRef) => Promise<RepositoryProfile>> = vi.fn(
            (repository: RepositoryRef) => Promise.resolve(profile(repository.slug))
        );
        const underTest: RepositoryProfileRetrievalService = new RepositoryProfileRetrievalService(
            "klaudiosinani",
            providerOf(provide)
        );

        const [first, second] = await Promise.all([underTest.retrieve("signale"), underTest.retrieve("signale")]);

        expect(provide).toHaveBeenCalledTimes(1);
        expect(first).toBe(second);
    });

    it("givenTwoSlugs_whenRetrieving_thenEachIsGatheredOnItsOwn", async () => {
        const provide: Mock<(repository: RepositoryRef) => Promise<RepositoryProfile>> = vi.fn(
            (repository: RepositoryRef) => Promise.resolve(profile(repository.slug))
        );
        const underTest: RepositoryProfileRetrievalService = new RepositoryProfileRetrievalService(
            "klaudiosinani",
            providerOf(provide)
        );

        const first: RepositoryProfile | null = await underTest.retrieve("signale");
        const second: RepositoryProfile | null = await underTest.retrieve("taskbook");

        expect(provide).toHaveBeenCalledTimes(2);
        expect(first?.slug).toBe("signale");
        expect(second?.slug).toBe("taskbook");
    });

    it("givenAFailedGather_whenRetrievingAgain_thenItIsRetriedRatherThanInheritingTheFailure", async () => {
        const provide: Mock<(repository: RepositoryRef) => Promise<RepositoryProfile | null>> = vi
            .fn<RepositoryProfileProvider["provide"]>()
            .mockRejectedValueOnce(new Error("rate limited"))
            .mockResolvedValueOnce(profile("signale"));
        const underTest: RepositoryProfileRetrievalService = new RepositoryProfileRetrievalService(
            "klaudiosinani",
            providerOf(provide)
        );

        await expect(underTest.retrieve("signale")).rejects.toThrow("rate limited");
        const retried: RepositoryProfile | null = await underTest.retrieve("signale");

        expect(provide).toHaveBeenCalledTimes(2);
        expect(retried?.slug).toBe("signale");
    });

    it("givenNoUsername_whenConstructing_thenTheConfiguredAccountIsUsed", async () => {
        const provide: Mock<(repository: RepositoryRef) => Promise<RepositoryProfile>> = vi.fn(
            (repository: RepositoryRef) => Promise.resolve(profile(repository.slug))
        );
        const underTest: RepositoryProfileRetrievalService = new RepositoryProfileRetrievalService(
            undefined,
            providerOf(provide)
        );

        await underTest.retrieve("signale");

        expect(provide).toHaveBeenCalledWith(new RepositoryRef("klaudiosinani", "signale"));
    });

    it("givenTheSharedInstance_whenAskedTwice_thenTheSameServiceIsReturned", () => {
        expect(RepositoryProfileRetrievalService.shared()).toBe(RepositoryProfileRetrievalService.shared());
    });
});
