export class SurfaceReach {
    private readonly name: string;
    private readonly note: string;
    private readonly href: string;
    private readonly stars: number | null;
    private readonly downloads: number | null;
    private readonly dependentRepositories: number | null;
    private readonly clones: number | null;

    public constructor(
        name: string,
        note: string,
        href: string,
        stars: number | null,
        downloads: number | null,
        dependentRepositories: number | null,
        clones: number | null
    ) {
        this.name = name;
        this.note = note;
        this.href = href;
        this.stars = stars;
        this.downloads = downloads;
        this.dependentRepositories = dependentRepositories;
        this.clones = clones;
    }

    public getName(): string {
        return this.name;
    }

    public getNote(): string {
        return this.note;
    }

    public getHref(): string {
        return this.href;
    }

    public getStars(): number | null {
        return this.stars;
    }

    public getDownloads(): number | null {
        return this.downloads;
    }

    public getDependentRepositories(): number | null {
        return this.dependentRepositories;
    }

    public getClones(): number | null {
        return this.clones;
    }
}
