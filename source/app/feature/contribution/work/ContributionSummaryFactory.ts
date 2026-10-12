import type { Contribution } from "./Contribution";
import { ContributionSummary } from "./ContributionSummary";

export class ContributionSummaryFactory {
    public create(contributions: readonly Contribution[]): ContributionSummary | null {
        if (contributions.length === 0) {
            return null;
        }

        const dates: string[] = contributions.map((contribution: Contribution) => contribution.getDate()).sort();

        return new ContributionSummary(
            contributions.length,
            this.tickets(contributions),
            dates[0],
            dates[dates.length - 1]
        );
    }

    private tickets(contributions: readonly Contribution[]): number {
        const named: Set<string> = new Set(
            contributions
                .map((contribution: Contribution) => contribution.getTicket())
                .filter((ticket: string | null): ticket is string => ticket !== null)
        );

        const unnamed: number = contributions.filter(
            (contribution: Contribution) => contribution.getTicket() === null
        ).length;

        return named.size + unnamed;
    }
}
