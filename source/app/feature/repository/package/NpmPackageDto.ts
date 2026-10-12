export class NpmPackageDto {
    private readonly latestVersion: string | null;
    private readonly maintainerNames: readonly string[];

    public constructor(latestVersion: string | null, maintainerNames: readonly string[]) {
        this.latestVersion = latestVersion;
        this.maintainerNames = maintainerNames;
    }

    public getLatestVersion(): string | null {
        return this.latestVersion;
    }

    public getMaintainerNames(): readonly string[] {
        return this.maintainerNames;
    }
}
