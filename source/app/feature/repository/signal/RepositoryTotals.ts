export class RepositoryTotals {
    private readonly commits: number;
    private readonly openIssues: number;
    private readonly closedIssues: number;
    private readonly openPullRequests: number;
    private readonly mergedPullRequests: number;

    public constructor(
        commits: number,
        openIssues: number,
        closedIssues: number,
        openPullRequests: number,
        mergedPullRequests: number
    ) {
        this.commits = commits;
        this.openIssues = openIssues;
        this.closedIssues = closedIssues;
        this.openPullRequests = openPullRequests;
        this.mergedPullRequests = mergedPullRequests;
    }

    public getCommits(): number {
        return this.commits;
    }
    public getOpenIssues(): number {
        return this.openIssues;
    }
    public getClosedIssues(): number {
        return this.closedIssues;
    }
    public getOpenPullRequests(): number {
        return this.openPullRequests;
    }
    public getMergedPullRequests(): number {
        return this.mergedPullRequests;
    }
}
