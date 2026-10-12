import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import { Software } from "./Software";

export class SoftwareFactory {
    public create(githubRepositoryData: GithubRepositoryData): Software {
        return new Software(
            githubRepositoryData.getName(),
            githubRepositoryData.getDescription() || "",
            githubRepositoryData.getStars(),
            githubRepositoryData.getForks(),
            githubRepositoryData.getLanguage(),
            githubRepositoryData.getLatestUpdate()
        );
    }
}
