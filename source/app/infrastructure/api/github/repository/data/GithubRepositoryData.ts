export class GithubRepositoryData {
    private readonly name: string;
    private readonly description: string;
    private readonly url: string;
    private readonly stars: number;
    private readonly forks: number;
    private readonly language: string | null;
    private readonly license: string | null;
    private readonly topics: string[];
    private readonly createdAt: string;
    private readonly latestUpdate: string;
    private readonly latestPush: string;

    public constructor(
        name: string,
        description: string,
        url: string,
        stars: number,
        forks: number,
        language: string | null,
        license: string | null,
        topics: string[],
        createdAt: string,
        latestUpdate: string,
        latestPush: string
    ) {
        this.name = name;
        this.description = description;
        this.url = url;
        this.stars = stars;
        this.forks = forks;
        this.language = language;
        this.license = license;
        this.topics = topics;
        this.createdAt = createdAt;
        this.latestUpdate = latestUpdate;
        this.latestPush = latestPush;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getUrl(): string {
        return this.url;
    }

    public getStars(): number {
        return this.stars;
    }

    public getForks(): number {
        return this.forks;
    }

    public getLanguage(): string | null {
        return this.language;
    }

    public getLicense(): string | null {
        return this.license;
    }

    public getTopics(): string[] {
        return this.topics;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getLatestUpdate(): string {
        return this.latestUpdate;
    }

    public getLatestPush(): string {
        return this.latestPush;
    }
}
