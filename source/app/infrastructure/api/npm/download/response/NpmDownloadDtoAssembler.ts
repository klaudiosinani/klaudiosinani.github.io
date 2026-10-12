import { NpmDownloadDto } from "./NpmDownloadDto.ts";

export class NpmDownloadDtoAssembler {
    public assemble(payload: unknown): NpmDownloadDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const day: unknown = record.day;
        const downloads: unknown = record.downloads;

        return new NpmDownloadDto(typeof day === "string" ? day : "", typeof downloads === "number" ? downloads : 0);
    }
}
