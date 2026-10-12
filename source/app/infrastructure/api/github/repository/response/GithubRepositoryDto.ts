export class GithubRepositoryDto {
    private readonly name: string;
    private readonly description: string | null;
    private readonly htmlUrl: string;
    private readonly stargazersCount: number;
    private readonly forksCount: number;
    private readonly language: string | null;
    private readonly licenseSpdxId: string | null;
    private readonly licenseName: string | null;
    private readonly topics: readonly string[];
    private readonly createdAt: string;
    private readonly updatedAt: string;
    private readonly pushedAt: string;

    public constructor(
        name: string,
        description: string | null,
        htmlUrl: string,
        stargazersCount: number,
        forksCount: number,
        language: string | null,
        licenseSpdxId: string | null,
        licenseName: string | null,
        topics: readonly string[],
        createdAt: string,
        updatedAt: string,
        pushedAt: string
    ) {
        this.name = name;
        this.description = description;
        this.htmlUrl = htmlUrl;
        this.stargazersCount = stargazersCount;
        this.forksCount = forksCount;
        this.language = language;
        this.licenseSpdxId = licenseSpdxId;
        this.licenseName = licenseName;
        this.topics = topics;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.pushedAt = pushedAt;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string | null {
        return this.description;
    }

    public getHtmlUrl(): string {
        return this.htmlUrl;
    }

    public getStargazersCount(): number {
        return this.stargazersCount;
    }

    public getForksCount(): number {
        return this.forksCount;
    }

    public getLanguage(): string | null {
        return this.language;
    }

    public getLicenseSpdxId(): string | null {
        return this.licenseSpdxId;
    }

    public getLicenseName(): string | null {
        return this.licenseName;
    }

    public getTopics(): readonly string[] {
        return this.topics;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public getPushedAt(): string {
        return this.pushedAt;
    }
}
