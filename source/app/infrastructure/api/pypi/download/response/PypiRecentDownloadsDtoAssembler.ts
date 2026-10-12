import { PypiRecentDownloadsDto } from "./PypiRecentDownloadsDto.ts";

export class PypiRecentDownloadsDtoAssembler {
    public assemble(payload: unknown): PypiRecentDownloadsDto {
        const record: Record<string, unknown> = (payload ?? {}) as Record<string, unknown>;
        const data: Record<string, unknown> = (record.data ?? {}) as Record<string, unknown>;
        const lastMonth: unknown = data.last_month;

        return new PypiRecentDownloadsDto(typeof lastMonth === "number" ? lastMonth : 0);
    }
}
