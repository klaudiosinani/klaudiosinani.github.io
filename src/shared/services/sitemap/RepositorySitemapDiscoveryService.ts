import { GITHUB_USERNAME, SITE } from "../../../config/site";

interface Repository {
  name: string;
}

export class RepositorySitemapDiscoveryService {
  private static readonly REPOSITORIES_PER_PAGE = 100;

  public static async discover(
    username: string = GITHUB_USERNAME
  ): Promise<string[]> {
    try {
      const repositories =
        await RepositorySitemapDiscoveryService.listRepositories(username);

      return await RepositorySitemapDiscoveryService.discoverSitemapUrls(
        repositories
      );
    } catch (error) {
      console.error("Error retrieving repository sitemaps:", error);
      return [];
    }
  }

  private static async listRepositories(
    username: string
  ): Promise<Repository[]> {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${RepositorySitemapDiscoveryService.REPOSITORIES_PER_PAGE}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }

    const repositories = (await response.json()) as Repository[];
    console.log(`Found ${repositories.length} repositories for @${username}`);

    return repositories;
  }

  private static async discoverSitemapUrls(
    repositories: Repository[]
  ): Promise<string[]> {
    const results = await Promise.all(
      repositories.map(({ name }) =>
        RepositorySitemapDiscoveryService.discoverSitemapUrl(name)
      )
    );

    const sitemapUrls = results.filter((url): url is string => url !== null);
    console.log(`Found ${sitemapUrls.length} valid sitemaps`);

    return sitemapUrls;
  }

  private static async discoverSitemapUrl(
    repositoryName: string
  ): Promise<string | null> {
    const sitemapUrl = new URL(`${repositoryName}/sitemap.xml`, SITE.website)
      .href;

    try {
      const response = await fetch(sitemapUrl, { method: "HEAD" });

      if (response.ok) {
        console.log(`Found sitemap: ${sitemapUrl}`);
        return sitemapUrl;
      }
    } catch (error) {
      console.error(`Error checking sitemap for ${repositoryName}:`, error);
    }

    return null;
  }
}
