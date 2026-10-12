import type { ContributionDay } from "@app/feature/impact/github/ContributionDay";

export class ContributionWeeksFactory {
    private readonly DAYS: number = 7;

    public create(days: readonly ContributionDay[]): (ContributionDay | null)[][] {
        if (days.length === 0) {
            return [];
        }

        const first: number = new Date(days[0].getDate()).getUTCDay();
        const places: (ContributionDay | null)[] = [...Array.from({ length: first }, () => null), ...days];
        const weeks: (ContributionDay | null)[][] = [];

        for (let at: number = 0; at < places.length; at += this.DAYS) {
            const week: (ContributionDay | null)[] = places.slice(at, at + this.DAYS);

            while (week.length < this.DAYS) {
                week.push(null);
            }

            weeks.push(week);
        }

        return weeks;
    }
}

export const CONTRIBUTION_WEEKS_FACTORY: ContributionWeeksFactory = new ContributionWeeksFactory();
