export class IssueTotals {
    private readonly commits: number;
    private readonly pullRequestsOpened: number;
    private readonly pullRequestsClosed: number;
    private readonly issuesOpened: number;
    private readonly issuesClosed: number;

    public constructor(
        commits: number,
        pullRequestsOpened: number,
        pullRequestsClosed: number,
        issuesOpened: number,
        issuesClosed: number
    ) {
        this.commits = commits;
        this.pullRequestsOpened = pullRequestsOpened;
        this.pullRequestsClosed = pullRequestsClosed;
        this.issuesOpened = issuesOpened;
        this.issuesClosed = issuesClosed;
    }

    public getCommits(): number {
        return this.commits;
    }
    public getPullRequestsOpened(): number {
        return this.pullRequestsOpened;
    }
    public getPullRequestsClosed(): number {
        return this.pullRequestsClosed;
    }
    public getIssuesOpened(): number {
        return this.issuesOpened;
    }
    public getIssuesClosed(): number {
        return this.issuesClosed;
    }
}
