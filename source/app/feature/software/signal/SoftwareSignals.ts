export class SoftwareSignals {
    private readonly languages: readonly string[];
    private readonly openIssues: number | null;
    private readonly openPullRequests: number | null;
    private readonly latestRelease: string | null;
    private readonly latestCommit: string | null;

    public constructor(
        languages: readonly string[],
        openIssues: number | null,
        openPullRequests: number | null,
        latestRelease: string | null,
        latestCommit: string | null
    ) {
        this.languages = languages;
        this.openIssues = openIssues;
        this.openPullRequests = openPullRequests;
        this.latestRelease = latestRelease;
        this.latestCommit = latestCommit;
    }

    public getLanguages(): readonly string[] {
        return this.languages;
    }

    public getOpenIssues(): number | null {
        return this.openIssues;
    }

    public getOpenPullRequests(): number | null {
        return this.openPullRequests;
    }

    public getLatestRelease(): string | null {
        return this.latestRelease;
    }

    public getLatestCommit(): string | null {
        return this.latestCommit;
    }
}
