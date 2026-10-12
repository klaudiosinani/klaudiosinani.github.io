import type { NpmDownloadDto } from "./NpmDownloadDto.ts";
import type { NpmDownloadDtoAssembler } from "./NpmDownloadDtoAssembler.ts";
import { NpmDownloadRangeDto } from "./NpmDownloadRangeDto.ts";

export class NpmDownloadRangeDtoAssembler {
    private readonly npmDownloadDtoAssembler: NpmDownloadDtoAssembler;

    public constructor(npmDownloadDtoAssembler: NpmDownloadDtoAssembler) {
        this.npmDownloadDtoAssembler = npmDownloadDtoAssembler;
    }

    public assemble(payload: unknown): NpmDownloadRangeDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const packageName: unknown = record.package;
        const downloads: unknown = record.downloads;
        const entries: unknown[] = Array.isArray(downloads) ? downloads : [];

        const npmDownloadDtos: NpmDownloadDto[] = entries.map((entry: unknown) =>
            this.npmDownloadDtoAssembler.assemble(entry)
        );

        return new NpmDownloadRangeDto(typeof packageName === "string" ? packageName : "", npmDownloadDtos);
    }
}
