import type { RepositoryData } from "./RepositoryData";
import type { RepositoryDataProvider } from "./RepositoryDataProvider";

export class MockRepositoryDataProvider implements RepositoryDataProvider {
  private static readonly PLACEHOLDERS: Omit<RepositoryData, "url">[] = [
    {
      name: "example-logger",
      description: "Highly configurable logging utility",
      stars: 9287,
      forks: 232,
      language: "TypeScript",
      latestUpdate: "2024-08-15T12:34:56Z",
    },
    {
      name: "example-taskboard",
      description: "Tasks, boards and notes for the command line",
      stars: 8452,
      forks: 319,
      language: "TypeScript",
      latestUpdate: "2024-09-10T09:12:34Z",
    },
    {
      name: "example-desktop-app",
      description: "Elegant cross-platform desktop client",
      stars: 5632,
      forks: 187,
      language: "JavaScript",
      latestUpdate: "2024-07-22T15:45:12Z",
    },
    {
      name: "example-functional",
      description: "Functional programming primitives",
      stars: 3245,
      forks: 97,
      language: "TypeScript",
      latestUpdate: "2024-08-30T18:23:45Z",
    },
    {
      name: "example-prompts",
      description: "Interactive command-line prompts",
      stars: 2156,
      forks: 76,
      language: "JavaScript",
      latestUpdate: "2024-07-18T10:15:22Z",
    },
  ];

  public async provide(username: string): Promise<RepositoryData[]> {
    return MockRepositoryDataProvider.PLACEHOLDERS.map(repository => ({
      ...repository,
      url: `https://github.com/${username}/${repository.name}`,
    }));
  }
}
