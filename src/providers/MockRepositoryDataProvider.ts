import type { RepositoryData } from "providers/RepositoryData";
import type { RepositoryDataProvider } from "providers/RepositoryProvider";

export class MockRepositoryDataProvider implements RepositoryDataProvider {
  async fetchRepositories(): Promise<RepositoryData[]> {
    return [
      {
        name: "signale",
        description: "Highly configurable logging utility",
        url: "https://github.com/klaudiosinani/signale",
        stars: 9287,
        forks: 232,
        language: "JavaScript",
        latestUpdate: "2023-08-15T12:34:56Z",
      },
      {
        name: "taskbook",
        description: "Tasks, boards & notes for the command-line habitat",
        url: "https://github.com/klaudiosinani/taskbook",
        stars: 8452,
        forks: 319,
        language: "JavaScript",
        latestUpdate: "2023-09-10T09:12:34Z",
      },
      {
        name: "ao",
        description: "Elegant Microsoft To-Do desktop app",
        url: "https://github.com/klaudiosinani/ao",
        stars: 5632,
        forks: 187,
        language: "TypeScript",
        latestUpdate: "2023-07-22T15:45:12Z",
      },
      {
        name: "arare",
        description: "Functional programming in TypeScript",
        url: "https://github.com/klaudiosinani/arare",
        stars: 3245,
        forks: 97,
        language: "TypeScript",
        latestUpdate: "2023-08-30T18:23:45Z",
      },
      {
        name: "tusk",
        description: "Refined Mastodon desktop app",
        url: "https://github.com/klaudiosinani/tusk",
        stars: 2890,
        forks: 134,
        language: "JavaScript",
        latestUpdate: "2023-09-05T14:28:39Z",
      },
      {
        name: "qoa",
        description: "Interactive command-line prompts",
        url: "https://github.com/klaudiosinani/qoa",
        stars: 2156,
        forks: 76,
        language: "JavaScript",
        latestUpdate: "2023-07-18T10:15:22Z",
      },
    ];
  }
}
