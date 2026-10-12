import type { CommitData } from "./CommitData";
import type { ReleaseData } from "./ReleaseData";

export class ActivityData {
    private readonly commits: CommitData[];
    private readonly releases: ReleaseData[];

    public constructor(commits: CommitData[], releases: ReleaseData[]) {
        this.commits = commits;
        this.releases = releases;
    }

    public getCommits(): CommitData[] {
        return this.commits;
    }
    public getReleases(): ReleaseData[] {
        return this.releases;
    }
}
