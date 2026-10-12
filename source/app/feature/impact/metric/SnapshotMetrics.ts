export class SnapshotMetrics {
    private readonly openPullRequests: number;
    private readonly openIssues: number;
    private readonly projects: number;
    private readonly stars: number;
    private readonly forks: number;

    public constructor(openPullRequests: number, openIssues: number, projects: number, stars: number, forks: number) {
        this.openPullRequests = openPullRequests;
        this.openIssues = openIssues;
        this.projects = projects;
        this.stars = stars;
        this.forks = forks;
    }

    public getOpenPullRequests(): number {
        return this.openPullRequests;
    }
    public getOpenIssues(): number {
        return this.openIssues;
    }
    public getProjects(): number {
        return this.projects;
    }
    public getStars(): number {
        return this.stars;
    }
    public getForks(): number {
        return this.forks;
    }
}
