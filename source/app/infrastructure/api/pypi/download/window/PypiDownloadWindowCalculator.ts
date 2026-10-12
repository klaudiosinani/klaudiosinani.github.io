import type { PypiDailyDownloadDto } from "../response/PypiDailyDownloadDto.ts";
import { PypiDownloadWindow } from "./PypiDownloadWindow.ts";

export class PypiDownloadWindowCalculator {
    public calculate(pypiDailyDownloadDtos: readonly PypiDailyDownloadDto[]): PypiDownloadWindow {
        const downloads: number = this.sum(pypiDailyDownloadDtos);
        const days: number = this.countDays(pypiDailyDownloadDtos);

        return new PypiDownloadWindow(downloads, days);
    }

    private sum(pypiDailyDownloadDtos: readonly PypiDailyDownloadDto[]): number {
        return pypiDailyDownloadDtos.reduce(
            (total: number, pypiDailyDownloadDto: PypiDailyDownloadDto) => total + pypiDailyDownloadDto.getDownloads(),
            0
        );
    }

    private countDays(pypiDailyDownloadDtos: readonly PypiDailyDownloadDto[]): number {
        const dates: string[] = pypiDailyDownloadDtos.map((pypiDailyDownloadDto: PypiDailyDownloadDto) =>
            pypiDailyDownloadDto.getDate()
        );
        const distinctDates: Set<string> = new Set<string>(dates);

        return distinctDates.size;
    }
}
