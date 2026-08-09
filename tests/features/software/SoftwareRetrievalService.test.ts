import { describe, expect, it, vi } from "vitest";
import { SoftwareRetrievalService } from "@features/software/SoftwareRetrievalService";
import { RepositoryDataRetrievalService } from "@services/github/RepositoryDataRetrievalService";
import type { RepositoryData } from "@services/github/RepositoryData";

const underTestFor = (
  repositories: RepositoryData[]
): SoftwareRetrievalService =>
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
  latestUpdate: "2026-01-01T00:00:00Z",
};

describe("SoftwareRetrievalService.retrieve", () => {
  it("givenARepository_whenRetrievingSoftware_thenItIsMappedOntoTheDomainModel", async () => {
    // given
    const underTest = underTestFor([repository]);

    // when
    const [software] = await underTest.retrieve();

    // then
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
    // given
    const underTest = underTestFor([{ ...repository, name: "signale" }]);

    // when
    const [software] = await underTest.retrieve();

    // then
    expect(software.homepageUrl).toBe("https://klaudiosinani.com/signale");
  });

  it("givenARepositoryWithoutADescription_whenRetrievingSoftware_thenTheBlankIsPreserved", async () => {
    // given
    const underTest = underTestFor([{ ...repository, description: "" }]);

    // when
    const [software] = await underTest.retrieve();

    // then
    expect(software.description).toBe("");
  });

  it("givenOrderedRepositories_whenRetrievingSoftware_thenTheOrderIsPreserved", async () => {
    // given
    const underTest = underTestFor([
      { ...repository, name: "first" },
      { ...repository, name: "second" },
    ]);

    // when
    const software = await underTest.retrieve();

    // then
    expect(software.map(({ name }) => name)).toEqual(["first", "second"]);
  });
});
