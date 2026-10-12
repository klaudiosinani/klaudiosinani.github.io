import { describe, expect, it } from "vitest";
import type { Contribution } from "@app/feature/contribution/Contribution";
import type { ContributionSummary } from "@app/feature/contribution/ContributionSummary";
import { ContributionSummaryFactory } from "@app/feature/contribution/factory/ContributionSummaryFactory";

const underTest: typeof ContributionSummaryFactory = ContributionSummaryFactory;

const contribution = (overrides: Partial<Contribution> = {}): Contribution => ({
    sha: "e6516103e4025854cc33236612e86317048f699e",
    shortSha: "e651610",
    url: "https://github.com/SonarSource/sonarqube/commit/e6516103",
    date: "2022-01-01T00:00:00Z",
    ticket: "SONAR-1",
    subject: "Add the thing",
    ...overrides,
});

describe("ContributionSummaryFactory.create", () => {
    it("givenCommitsOverTime_whenSummarised_thenTheFiguresStateTheWhole", () => {
        const contributions: Contribution[] = [
            contribution({ date: "2022-11-30T00:00:00Z", ticket: "SONAR-3" }),
            contribution({ date: "2021-10-28T00:00:00Z", ticket: "SONAR-1" }),
            contribution({ date: "2022-05-23T00:00:00Z", ticket: "SONAR-2" }),
        ];

        const summary: ContributionSummary | null = underTest.create(contributions);

        expect(summary).toEqual({
            commits: 3,
            tickets: 3,
            from: "2021-10-28T00:00:00Z",
            to: "2022-11-30T00:00:00Z",
        });
    });

    it("givenSeveralCommitsUnderOneTicket_whenSummarised_thenTheTicketCountsOnce", () => {
        const contributions: Contribution[] = [
            contribution({ ticket: "SONAR-16316" }),
            contribution({ ticket: "SONAR-16316" }),
            contribution({ ticket: "SONAR-16316" }),
        ];

        const summary: ContributionSummary | null = underTest.create(contributions);

        expect(summary?.tickets).toBe(1);
    });

    it("givenCommitsUnderNoTicket_whenSummarised_thenEachOneIsAPieceOfWorkOfItsOwn", () => {
        const contributions: Contribution[] = [
            contribution({ ticket: null }),
            contribution({ ticket: null }),
            contribution({ ticket: "SONAR-1" }),
        ];

        const summary: ContributionSummary | null = underTest.create(contributions);

        expect(summary?.tickets).toBe(3);
    });

    it("givenNoCommits_whenSummarised_thenThereAreNoFiguresToState", () => {
        expect(underTest.create([])).toBeNull();
    });
});
