import type { RepositoryFacts } from "@app/feature/repository/profile/RepositoryFacts";
import type { RepositoryProfile } from "../profile/RepositoryProfile";

export class RepositoryDownloadChart {
    private readonly repositoryFacts: RepositoryFacts;

    public constructor(repositoryFacts: RepositoryFacts) {
        this.repositoryFacts = repositoryFacts;
    }
    public drawable(profile: RepositoryProfile): boolean {
        return this.repositoryFacts.hasDownloads(profile) && profile.trend.length > 0;
    }
}
