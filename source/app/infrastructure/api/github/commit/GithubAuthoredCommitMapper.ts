import type { GithubAuthoredCommit } from "./GithubAuthoredCommit.ts";
import type { GithubCommitDto } from "./GithubCommitDto.ts";

export class GithubAuthoredCommitMapper {
    public map(githubCommitDto: GithubCommitDto): GithubAuthoredCommit {
        return {
            sha: githubCommitDto.getSha(),
            url: githubCommitDto.getHtmlUrl(),
            message: githubCommitDto.getMessage(),
            date: githubCommitDto.getAuthoredAt(),
        };
    }
}
