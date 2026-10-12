export class AuthorPortrait {
    private readonly gitHubUsername: string;
    private readonly name: string;
    private readonly endings: Readonly<Record<string, string>>;
    private readonly pixels: number;

    public constructor(
        gitHubUsername: string,
        name: string,
        endings: Readonly<Record<string, string>>,
        pixels: number
    ) {
        this.gitHubUsername = gitHubUsername;
        this.name = name;
        this.endings = endings;
        this.pixels = pixels;
    }

    public getSource(): string {
        return `https://github.com/${this.gitHubUsername}.png?size=${this.pixels}`;
    }

    public getName(): string {
        return this.name;
    }

    public getEndings(): readonly string[] {
        return Object.values(this.endings);
    }

    public getPixels(): number {
        return this.pixels;
    }

    public resolveEnding(mediaType: string): string | undefined {
        return this.endings[mediaType];
    }

    public resolvePath(ending: string): string {
        return `/${this.name}.${ending}`;
    }
}
