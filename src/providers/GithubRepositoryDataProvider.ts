import type { RepositoryData } from "providers/RepositoryData";
import type { RepositoryDataProvider } from "providers/RepositoryProvider";

export class GitHubRepositoryDataProvider implements RepositoryDataProvider {
  async fetchRepositories(username: string): Promise<RepositoryData[]> {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} - ${response.statusText}`
      );
    }

    const repositories = await response.json();

    repositories.sort((x, y) => y.stargazers_count - x.stargazers_count);

    return repositories.map(repo => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      latestUpdate: repo.updated_at,
    }));
  }
}
