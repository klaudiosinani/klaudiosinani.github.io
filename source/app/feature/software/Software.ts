export class Software {
    private readonly name: string;
    private readonly description: string;
    private readonly stars: number;
    private readonly forks: number;
    private readonly language: string | null;
    private readonly latestUpdate: string;

    public constructor(
        name: string,
        description: string,
        stars: number,
        forks: number,
        language: string | null,
        latestUpdate: string
    ) {
        this.name = name;
        this.description = description;
        this.stars = stars;
        this.forks = forks;
        this.language = language;
        this.latestUpdate = latestUpdate;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
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

    public getLatestUpdate(): string {
        return this.latestUpdate;
    }
}
