import type { GitHubRepository } from "./GitHubRepository";
import type { RepositoryData } from "./RepositoryData";
import type { RepositoryDataProvider } from "./RepositoryDataProvider";

export class GitHubRepositoryDataProvider implements RepositoryDataProvider {
  private static readonly REPOSITORIES_PER_PAGE = 100;
  private static readonly MAX_PAGES = 10;
  private static readonly API_VERSION = "2022-11-28";

  public async provide(username: string): Promise<RepositoryData[]> {
    const repositories: GitHubRepository[] = [];

    for (let page = 1; page <= GitHubRepositoryDataProvider.MAX_PAGES; page++) {
      const batch = await this.fetchPage(username, page);
      repositories.push(...batch);

      if (batch.length < GitHubRepositoryDataProvider.REPOSITORIES_PER_PAGE) {
        return GitHubRepositoryDataProvider.toRepositoryData(repositories);
      }
    }

    console.warn(
      `GitHub repository listing truncated at ${
        GitHubRepositoryDataProvider.MAX_PAGES *
        GitHubRepositoryDataProvider.REPOSITORIES_PER_PAGE
      } entries for @${username}`
    );

    return GitHubRepositoryDataProvider.toRepositoryData(repositories);
  }

  private async fetchPage(
    username: string,
    page: number
  ): Promise<GitHubRepository[]> {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${GitHubRepositoryDataProvider.REPOSITORIES_PER_PAGE}&page=${page}`,
      {
        headers: {
          "X-GitHub-Api-Version": GitHubRepositoryDataProvider.API_VERSION,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} - ${response.statusText}`
      );
    }

    return (await response.json()) as GitHubRepository[];
  }

  private static toRepositoryData(
    repositories: GitHubRepository[]
  ): RepositoryData[] {
    return repositories
      .sort(
        (first, second) =>
          second.stargazers_count - first.stargazers_count ||
          first.name.localeCompare(second.name)
      )
      .map(repository => ({
        name: repository.name,
        description: repository.description || "",
        url: repository.html_url,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        language: repository.language,
        latestUpdate: repository.updated_at,
      }));
  }
}
