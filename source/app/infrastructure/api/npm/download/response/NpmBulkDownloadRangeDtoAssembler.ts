import { NpmBulkDownloadRangeDto } from "./NpmBulkDownloadRangeDto.ts";
import type { NpmDownloadRangeDto } from "./NpmDownloadRangeDto.ts";
import type { NpmDownloadRangeDtoAssembler } from "./NpmDownloadRangeDtoAssembler.ts";

export class NpmBulkDownloadRangeDtoAssembler {
    private readonly npmDownloadRangeDtoAssembler: NpmDownloadRangeDtoAssembler;

    public constructor(npmDownloadRangeDtoAssembler: NpmDownloadRangeDtoAssembler) {
        this.npmDownloadRangeDtoAssembler = npmDownloadRangeDtoAssembler;
    }

    public assemble(payload: unknown): NpmBulkDownloadRangeDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const rangesByPackageName: Map<string, NpmDownloadRangeDto | null> = new Map<
            string,
            NpmDownloadRangeDto | null
        >();

        for (const [packageName, entry] of Object.entries(record)) {
            rangesByPackageName.set(
                packageName,
                entry === null ? null : this.npmDownloadRangeDtoAssembler.assemble(entry)
            );
        }

        return new NpmBulkDownloadRangeDto(rangesByPackageName);
    }
}
