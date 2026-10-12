import { PypiDailyDownloadDto } from "./PypiDailyDownloadDto.ts";

export class PypiDailyDownloadDtoAssembler {
    public assemble(payload: unknown): PypiDailyDownloadDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const date: unknown = record.date;
        const downloads: unknown = record.downloads;

        return new PypiDailyDownloadDto(
            typeof date === "string" ? date : "",
            typeof downloads === "number" ? downloads : 0
        );
    }
}
