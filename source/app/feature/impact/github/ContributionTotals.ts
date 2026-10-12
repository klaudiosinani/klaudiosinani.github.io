import type { ContributionDay } from "@app/feature/impact/github/ContributionDay";

export class ContributionTotals {
    private readonly commits: number;
    private readonly activeDays: number;
    private readonly days: ContributionDay[];

    public constructor(commits: number, activeDays: number, days: ContributionDay[]) {
        this.commits = commits;
        this.activeDays = activeDays;
        this.days = days;
    }

    public getCommits(): number {
        return this.commits;
    }
    public getActiveDays(): number {
        return this.activeDays;
    }
    public getDays(): ContributionDay[] {
        return this.days;
    }
}
