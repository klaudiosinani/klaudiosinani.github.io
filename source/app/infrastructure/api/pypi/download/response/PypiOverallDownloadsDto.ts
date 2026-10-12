import type { PypiDailyDownloadDto } from "./PypiDailyDownloadDto.ts";

export class PypiOverallDownloadsDto {
    private readonly days: readonly PypiDailyDownloadDto[];

    public constructor(days: readonly PypiDailyDownloadDto[]) {
        this.days = days;
    }

    public getDays(): readonly PypiDailyDownloadDto[] {
        return this.days;
    }
}
