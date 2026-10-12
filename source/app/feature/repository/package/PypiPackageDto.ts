export class PypiPackageDto {
    private readonly version: string | null;
    private readonly projectUrls: readonly string[];

    public constructor(version: string | null, projectUrls: readonly string[]) {
        this.version = version;
        this.projectUrls = projectUrls;
    }

    public getVersion(): string | null {
        return this.version;
    }

    public getProjectUrls(): readonly string[] {
        return this.projectUrls;
    }
}
