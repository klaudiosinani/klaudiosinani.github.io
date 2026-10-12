import { describe, expect, it } from "vitest";
import type { ContributedRepository } from "@app/configuration/ContributedRepository";
import type { ContributedWork } from "@app/feature/contribution/ContributedWork";
import { ContributedWorkService } from "@app/feature/contribution/service/ContributedWorkService";

const REPOSITORY: ContributedRepository = {
    owner: "SonarSource",
    name: "sonarqube",
    title: "SonarQube",
    url: "https://github.com/SonarSource/sonarqube",
    summary: "SonarQube examines code.",
    role: "I was a senior software engineer there.",
};

describe("ContributedWorkService.retrieve", () => {
    it("givenACodebase_whenRetrieving_thenItsCommitsAndItsFiguresArriveTogether", async () => {
        const underTest: ContributedWorkService = new ContributedWorkService([REPOSITORY]);

        const [held]: ContributedWork[] = await underTest.retrieve();

        expect(held.repository).toBe(REPOSITORY);
        expect(held.contributions.length).toBeGreaterThan(0);
        expect(held.summary?.commits).toBe(held.contributions.length);
    });

    it("givenNoCodebases_whenRetrieving_thenNothingIsGathered", async () => {
        expect(await new ContributedWorkService([]).retrieve()).toEqual([]);
    });

    it("givenTheSharedService_whenAskedTwice_thenTheSameOneAnswers", () => {
        expect(ContributedWorkService.shared()).toBe(ContributedWorkService.shared());
    });
});
