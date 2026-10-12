import type { CountedDto } from "../download/CountedDto";

export class RepositoryTotalsNodeDto {
    private readonly commits: CountedDto;
    private readonly openIssues: CountedDto;
    private readonly closedIssues: CountedDto;
    private readonly openPullRequests: CountedDto;
    private readonly mergedPullRequests: CountedDto;

    public constructor(
        commits: CountedDto,
        openIssues: CountedDto,
        closedIssues: CountedDto,
        openPullRequests: CountedDto,
        mergedPullRequests: CountedDto
    ) {
        this.commits = commits;
        this.openIssues = openIssues;
        this.closedIssues = closedIssues;
        this.openPullRequests = openPullRequests;
        this.mergedPullRequests = mergedPullRequests;
    }

    public getCommits(): CountedDto {
        return this.commits;
    }

    public getOpenIssues(): CountedDto {
        return this.openIssues;
    }

    public getClosedIssues(): CountedDto {
        return this.closedIssues;
    }

    public getOpenPullRequests(): CountedDto {
        return this.openPullRequests;
    }

    public getMergedPullRequests(): CountedDto {
        return this.mergedPullRequests;
    }
}
