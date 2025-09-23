// Constants
const DEFAULT_USERNAME = 'klaudiosinani';
const HTTP_HEAD_METHOD = 'HEAD';
const MAX_REPOS_PER_PAGE = 100;

const GITHUB_API_URL_TEMPLATE = 'https://api.github.com/users/{username}/repos?per_page={perPage}';
const GITHUB_PAGES_SITEMAP_TEMPLATE = 'https://{username}.com/{repo}/sitemap.xml';

const LOG_FOUND_SITEMAP = 'Found sitemap: {url}';
const LOG_ERROR_CHECKING_SITEMAP = 'Error checking sitemap for {repo}:';
const LOG_FOUND_REPOSITORIES = 'Found {count} repositories for @{username}';
const LOG_FOUND_VALID_SITEMAPS = 'Found {count} valid sitemaps';
const LOG_ERROR_RETRIEVING_SITEMAPS = 'Error retrieving repository sitemaps:';
const ERROR_FETCH_REPOSITORIES = 'Failed to fetch repositories: {status}';

interface Repository {
  name: string;
}

async function checkRepositoryForSitemap(
  repoName: string,
  username: string
): Promise<string | null> {
  const sitemapUrl = GITHUB_PAGES_SITEMAP_TEMPLATE
    .replace('{username}', username)
    .replace('{repo}', repoName);
  
  try {
    const response = await fetch(sitemapUrl, { method: HTTP_HEAD_METHOD });
    
    if (response.ok) {
      console.log(LOG_FOUND_SITEMAP.replace('{url}', sitemapUrl));
      return sitemapUrl;
    }
  } catch (error) {
    console.error(
      LOG_ERROR_CHECKING_SITEMAP.replace('{repo}', repoName), 
      error
    );
  }
  
  return null;
}

async function fetchUserRepositories(username: string): Promise<Repository[]> {
  const apiUrl = GITHUB_API_URL_TEMPLATE
    .replace('{username}', username)
    .replace('{perPage}', MAX_REPOS_PER_PAGE.toString());
    
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(
      ERROR_FETCH_REPOSITORIES.replace('{status}', response.statusText)
    );
  }
  
  const repositories: Repository[] = await response.json();
  console.log(
    LOG_FOUND_REPOSITORIES
      .replace('{count}', repositories.length.toString())
      .replace('{username}', username)
  );
  
  return repositories;
}

async function checkRepositoriesForSitemaps(
  repositories: Repository[],
  username: string
): Promise<string[]> {
  const sitemapPromises = repositories
    .map(repo => checkRepositoryForSitemap(repo.name, username));

  const results = await Promise.all(sitemapPromises);
  const validSitemaps = results.filter(Boolean) as string[];
  
  console.log(
    LOG_FOUND_VALID_SITEMAPS.replace('{count}', validSitemaps.length.toString())
  );
  return validSitemaps;
}

export async function retrieveRepositoryPageSitemaps(
  username: string = DEFAULT_USERNAME
): Promise<string[]> {
  try {
    const repositories = await fetchUserRepositories(username);
    return await checkRepositoriesForSitemaps(repositories, username);
  } catch (error) {
    console.error(LOG_ERROR_RETRIEVING_SITEMAPS, error);
    return [];
  }
}

export default retrieveRepositoryPageSitemaps;