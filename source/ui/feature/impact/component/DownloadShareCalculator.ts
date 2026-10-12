import type { DownloadShare } from "./DownloadShare";
import type { Outlet } from "@app/feature/impact/outlet/Outlet";
import type { OutletDownloads } from "@app/feature/impact/outlet/OutletDownloads";
import type { ReportingPeriod } from "@app/util/period/ReportingPeriod";

export class DownloadShareCalculator {
    private readonly NAMES: Readonly<Record<Outlet, string>> = {
        npm: "npm",
        github: "GitHub releases",
        pypi: "PyPI",
        homebrew: "Homebrew",
    };

    public compute(outlets: readonly OutletDownloads[], period: ReportingPeriod): DownloadShare[] {
        const counted: { outlet: Outlet; value: number }[] = outlets
            .map((downloads: OutletDownloads) => ({
                outlet: downloads.getOutlet(),
                value: downloads[period] ?? 0,
            }))
            .filter(({ value }: { outlet: Outlet; value: number }) => value > 0);

        const total: number = counted.reduce(
            (sum: number, { value }: { outlet: Outlet; value: number }) => sum + value,
            0
        );

        if (total === 0) {
            return [];
        }

        return counted
            .map(({ outlet, value }: { outlet: Outlet; value: number }) => ({
                outlet,
                name: this.NAMES[outlet],
                value,
                share: value / total,
            }))
            .sort((first: DownloadShare, second: DownloadShare) =>
                second.value === first.value ? first.name.localeCompare(second.name) : second.value - first.value
            );
    }
}

export const DOWNLOAD_SHARE_CALCULATOR: DownloadShareCalculator = new DownloadShareCalculator();
