import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";

export class DependentTotalCalculator {
    public total(repositoryProfiles: readonly RepositoryProfile[]): number | null {
        const counted: number[] = repositoryProfiles
            .map((repositoryProfile: RepositoryProfile) => repositoryProfile.dependents?.getRepositories() ?? null)
            .filter((count: number | null): count is number => count !== null);

        return counted.length === 0 ? null : counted.reduce((sum: number, count: number) => sum + count, 0);
    }
}
