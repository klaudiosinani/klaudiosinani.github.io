export class OpenTotals {
    private readonly openPullRequests: number;
    private readonly openIssues: number;

    public constructor(openPullRequests: number, openIssues: number) {
        this.openPullRequests = openPullRequests;
        this.openIssues = openIssues;
    }

    public getOpenPullRequests(): number {
        return this.openPullRequests;
    }
    public getOpenIssues(): number {
        return this.openIssues;
    }
}
