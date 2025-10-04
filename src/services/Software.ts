export interface Software {
  name: string;
  description: string;
  repositoryUrl: string;
  homepageUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  latestUpdate: string;
}
