import type { PypiDailyDownloadDto } from "./PypiDailyDownloadDto.ts";
import type { PypiDailyDownloadDtoAssembler } from "./PypiDailyDownloadDtoAssembler.ts";
import { PypiOverallDownloadsDto } from "./PypiOverallDownloadsDto.ts";

export class PypiOverallDownloadsDtoAssembler {
    private readonly pypiDailyDownloadDtoAssembler: PypiDailyDownloadDtoAssembler;

    public constructor(pypiDailyDownloadDtoAssembler: PypiDailyDownloadDtoAssembler) {
        this.pypiDailyDownloadDtoAssembler = pypiDailyDownloadDtoAssembler;
    }

    public assemble(payload: unknown): PypiOverallDownloadsDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const data: unknown = record.data;
        const entries: unknown[] = Array.isArray(data) ? data : [];

        const days: PypiDailyDownloadDto[] = entries.map((entry: unknown) =>
            this.pypiDailyDownloadDtoAssembler.assemble(entry)
        );

        return new PypiOverallDownloadsDto(days);
    }
}
