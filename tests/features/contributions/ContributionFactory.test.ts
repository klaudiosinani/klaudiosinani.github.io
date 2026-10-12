import { describe, expect, it } from "vitest";
import type { AuthoredCommit } from "@app/infrastructure/github/domain/AuthoredCommit";
import type { Contribution } from "@app/feature/contribution/Contribution";
import { ContributionFactory } from "@app/feature/contribution/factory/ContributionFactory";

const underTest: typeof ContributionFactory = ContributionFactory;

const commit = (overrides: Partial<AuthoredCommit> = {}): AuthoredCommit => ({
    sha: "e6516103e4025854cc33236612e86317048f699e",
    url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
    message: "SONAR-15574 Add package info file",
    date: "2021-10-28T15:38:53Z",
    ...overrides,
});

describe("ContributionFactory.create", () => {
    it("givenACommit_whenCreating_thenTheTicketAndTheSubjectStandApart", () => {
        const [made]: Contribution[] = underTest.create([commit()]);

        expect(made).toEqual({
            sha: "e6516103e4025854cc33236612e86317048f699e",
            shortSha: "e651610",
            url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
            date: "2021-10-28T15:38:53Z",
            ticket: "SONAR-15574",
            subject: "Add package info file",
        });
    });

    it("givenCommitsInTheOrderOfTheBranch_whenCreating_thenTheNewestIsFirst", () => {
        const commits: AuthoredCommit[] = [
            commit({ sha: "a", date: "2022-11-29T00:00:00Z" }),
            commit({ sha: "b", date: "2022-11-30T00:00:00Z" }),
            commit({ sha: "c", date: "2022-11-26T00:00:00Z" }),
        ];

        const made: Contribution[] = underTest.create(commits);

        expect(made.map(({ sha }: Contribution) => sha)).toEqual(["b", "a", "c"]);
    });

    it("givenTwoCommitsOfOneMoment_whenCreating_thenTheirNamesDecideTheOrder", () => {
        const commits: AuthoredCommit[] = [
            commit({ sha: "zebra", date: "2022-01-01T00:00:00Z" }),
            commit({ sha: "alpha", date: "2022-01-01T00:00:00Z" }),
        ];

        const made: Contribution[] = underTest.create(commits);

        expect(made.map(({ sha }: Contribution) => sha)).toEqual(["alpha", "zebra"]);
    });

    it("givenNoCommits_whenCreating_thenTheListIsEmpty", () => {
        expect(underTest.create([])).toEqual([]);
    });
});
