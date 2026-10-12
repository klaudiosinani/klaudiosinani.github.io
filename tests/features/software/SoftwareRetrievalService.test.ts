import { describe, expect, it, vi } from "vitest";
import { SoftwareRetrievalService } from "@app/feature/software/service/SoftwareRetrievalService";
import { RepositoryDataRetrievalService } from "@app/infrastructure/github/service/RepositoryDataRetrievalService";
import type { RepositoryData } from "@app/infrastructure/github/domain/RepositoryData";
import type { Software } from "@app/feature/software/Software";

const underTestFor = (repositories: RepositoryData[]): SoftwareRetrievalService =>
    new SoftwareRetrievalService(
        new RepositoryDataRetrievalService("user", {
            provide: vi.fn().mockResolvedValue(repositories),
        })
    );

const repository: RepositoryData = {
    name: "taskbook",
    description: "Tasks, boards and notes",
    url: "https://github.com/user/taskbook",
    stars: 9000,
    forks: 300,
    language: "JavaScript",
    license: "MIT",
    topics: [],
    createdAt: "2018-01-19T00:00:00Z",
    latestUpdate: "2026-01-01T00:00:00Z",
    latestPush: "2026-01-01T00:00:00Z",
};

describe("SoftwareRetrievalService.retrieve", () => {
    it("givenARepository_whenRetrievingSoftware_thenItIsMappedOntoTheDomainModel", async () => {
        const underTest: SoftwareRetrievalService = underTestFor([repository]);

        const [software] = await underTest.retrieve();

        expect(software).toEqual({
            name: "taskbook",
            description: "Tasks, boards and notes",
            repositoryUrl: "https://github.com/user/taskbook",
            homepageUrl: "https://klaudiosinani.com/taskbook",
            stars: 9000,
            forks: 300,
            language: "JavaScript",
            latestUpdate: "2026-01-01T00:00:00Z",
        });
    });

    it("givenARepositoryName_whenRetrievingSoftware_thenItsHomepageIsUnderThisSite", async () => {
        const underTest: SoftwareRetrievalService = underTestFor([{ ...repository, name: "signale" }]);

        const [software] = await underTest.retrieve();

        expect(software.homepageUrl).toBe("https://klaudiosinani.com/signale");
    });

    it("givenARepositoryWithoutADescription_whenRetrievingSoftware_thenTheBlankIsPreserved", async () => {
        const underTest: SoftwareRetrievalService = underTestFor([{ ...repository, description: "" }]);

        const [software] = await underTest.retrieve();

        expect(software.description).toBe("");
    });

    it("givenOrderedRepositories_whenRetrievingSoftware_thenTheOrderIsPreserved", async () => {
        const underTest: SoftwareRetrievalService = underTestFor([
            { ...repository, name: "first" },
            { ...repository, name: "second" },
        ]);

        const software: Software[] = await underTest.retrieve();

        expect(software.map(({ name }: Software) => name)).toEqual(["first", "second"]);
    });
});
