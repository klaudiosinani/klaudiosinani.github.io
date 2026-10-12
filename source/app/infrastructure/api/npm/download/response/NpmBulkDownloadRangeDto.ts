import type { NpmDownloadRangeDto } from "./NpmDownloadRangeDto.ts";

export class NpmBulkDownloadRangeDto {
    private readonly rangesByPackageName: ReadonlyMap<string, NpmDownloadRangeDto | null>;

    public constructor(rangesByPackageName: ReadonlyMap<string, NpmDownloadRangeDto | null>) {
        this.rangesByPackageName = rangesByPackageName;
    }

    public getRangesByPackageName(): ReadonlyMap<string, NpmDownloadRangeDto | null> {
        return this.rangesByPackageName;
    }
}
