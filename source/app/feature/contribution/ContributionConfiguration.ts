export class ContributionConfiguration {
    private readonly CONTRIBUTIONS_PER_PAGE: number = 20;

    public getContributionsPerPage(): number {
        return this.CONTRIBUTIONS_PER_PAGE;
    }
}
