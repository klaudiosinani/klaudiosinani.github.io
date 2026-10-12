import type { ImpactData } from "@app/feature/impact/metric/ImpactData";
import type { Outlet } from "@app/feature/impact/outlet/Outlet";
import type { OutletDownloads } from "@app/feature/impact/outlet/OutletDownloads";
import type { SourceState } from "./SourceState";

export class SourceStateFactory {
    private readonly OUTLETS: Readonly<Record<Outlet, string>> = {
        npm: "npm",
        github: "GitHub releases",
        pypi: "PyPI",
        homebrew: "Homebrew",
    };

    public create(impact: ImpactData): SourceState[] {
        const outlets: SourceState[] = impact.getOutlets().map((downloads: OutletDownloads) => ({
            name: this.OUTLETS[downloads.getOutlet()],
            answered: downloads.getAll() !== null,
            absent: "the downloads it counts",
        }));

        return [
            ...outlets,
            {
                name: "GitHub traffic",
                answered: impact.getTraffic() !== null,
                absent: "the clones and the views",
            },
            {
                name: "Snap Store",
                answered: impact.getInstalledBase() !== null,
                absent: "the installed base of the snaps",
            },
        ];
    }
}

export const SOURCE_STATE_FACTORY: SourceStateFactory = new SourceStateFactory();
