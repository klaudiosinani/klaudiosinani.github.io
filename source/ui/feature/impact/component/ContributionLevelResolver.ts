export class ContributionLevelResolver {
    private readonly STEPS: readonly number[] = [1, 4, 8, 12];

    public resolve(count: number): number {
        if (count <= 0) {
            return 0;
        }

        return Math.max(1, this.STEPS.filter((step: number) => count >= step).length);
    }
}

export const CONTRIBUTION_LEVEL_RESOLVER: ContributionLevelResolver = new ContributionLevelResolver();
