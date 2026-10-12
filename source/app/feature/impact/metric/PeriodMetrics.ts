import type { PeriodMetricKey } from "./PeriodMetricKey";
export class PeriodMetrics {
    private readonly downloads: number;
    private readonly commits: number;
    private readonly activeDays: number | null;
    private readonly releases: number;
    private readonly pullRequestsOpened: number;
    private readonly pullRequestsClosed: number;
    private readonly issuesOpened: number;
    private readonly issuesClosed: number;

    public constructor(
        downloads: number,
        commits: number,
        activeDays: number | null,
        releases: number,
        pullRequestsOpened: number,
        pullRequestsClosed: number,
        issuesOpened: number,
        issuesClosed: number
    ) {
        this.downloads = downloads;
        this.commits = commits;
        this.activeDays = activeDays;
        this.releases = releases;
        this.pullRequestsOpened = pullRequestsOpened;
        this.pullRequestsClosed = pullRequestsClosed;
        this.issuesOpened = issuesOpened;
        this.issuesClosed = issuesClosed;
    }

    public getDownloads(): number {
        return this.downloads;
    }
    public getCommits(): number {
        return this.commits;
    }
    public getActiveDays(): number | null {
        return this.activeDays;
    }
    public getReleases(): number {
        return this.releases;
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

    public getValue(periodMetricKey: PeriodMetricKey): number | null {
        switch (periodMetricKey) {
            case "downloads":
                return this.downloads;
            case "commits":
                return this.commits;
            case "activeDays":
                return this.activeDays;
            case "releases":
                return this.releases;
            case "pullRequestsOpened":
                return this.pullRequestsOpened;
            case "pullRequestsClosed":
                return this.pullRequestsClosed;
            case "issuesOpened":
                return this.issuesOpened;
            case "issuesClosed":
                return this.issuesClosed;
        }
    }
}
