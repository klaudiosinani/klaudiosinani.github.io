import type { GithubRepositoryDto } from "../response/GithubRepositoryDto.ts";
import { GithubRepositoryData } from "./GithubRepositoryData.ts";

export class GithubRepositoryDataMapper {
    private readonly UNIDENTIFIED_LICENSE: string = "NOASSERTION";

    public map(githubRepositoryDto: GithubRepositoryDto): GithubRepositoryData {
        const license: string | null = this.resolveLicense(githubRepositoryDto);

        return new GithubRepositoryData(
            githubRepositoryDto.getName(),
            githubRepositoryDto.getDescription() ?? "",
            githubRepositoryDto.getHtmlUrl(),
            githubRepositoryDto.getStargazersCount(),
            githubRepositoryDto.getForksCount(),
            githubRepositoryDto.getLanguage(),
            license,
            [...githubRepositoryDto.getTopics()],
            githubRepositoryDto.getCreatedAt(),
            githubRepositoryDto.getUpdatedAt(),
            githubRepositoryDto.getPushedAt()
        );
    }

    private resolveLicense(githubRepositoryDto: GithubRepositoryDto): string | null {
        const spdxId: string | null = githubRepositoryDto.getLicenseSpdxId();
        const name: string | null = githubRepositoryDto.getLicenseName();

        if (spdxId === null && name === null) {
            return null;
        }

        if (spdxId === null || spdxId === this.UNIDENTIFIED_LICENSE) {
            return name;
        }

        return spdxId;
    }
}
