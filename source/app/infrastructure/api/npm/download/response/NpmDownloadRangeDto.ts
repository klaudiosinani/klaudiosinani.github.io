import type { NpmDownloadDto } from "./NpmDownloadDto.ts";

export class NpmDownloadRangeDto {
    private readonly packageName: string;
    private readonly downloads: readonly NpmDownloadDto[];

    public constructor(packageName: string, downloads: readonly NpmDownloadDto[]) {
        this.packageName = packageName;
        this.downloads = downloads;
    }

    public getPackageName(): string {
        return this.packageName;
    }

    public getDownloads(): readonly NpmDownloadDto[] {
        return this.downloads;
    }
}
