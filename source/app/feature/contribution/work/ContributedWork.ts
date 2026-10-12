import type { ContributedRepository } from "@app/configuration/repository/ContributedRepository";
import type { Contribution } from "./Contribution";
import type { ContributionSummary } from "./ContributionSummary";

export class ContributedWork {
    private readonly repository: ContributedRepository;
    private readonly contributions: readonly Contribution[];
    private readonly summary: ContributionSummary | null;

    public constructor(
        repository: ContributedRepository,
        contributions: readonly Contribution[],
        summary: ContributionSummary | null
    ) {
        this.repository = repository;
        this.contributions = contributions;
        this.summary = summary;
    }

    public getRepository(): ContributedRepository {
        return this.repository;
    }
    public getContributions(): readonly Contribution[] {
        return this.contributions;
    }
    public getSummary(): ContributionSummary | null {
        return this.summary;
    }
}
