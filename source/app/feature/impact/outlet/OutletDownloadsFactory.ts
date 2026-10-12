import type { ReleaseTotals } from "../github/ReleaseTotals";
import { OutletDownloads } from "./OutletDownloads";
import type { NpmDownloadTotals } from "@app/infrastructure/api/npm/download/totals/NpmDownloadTotals";

export class OutletDownloadsFactory {
    public create(npm: NpmDownloadTotals, releases: ReleaseTotals, sourced: OutletDownloads[]): OutletDownloads[] {
        return [
            new OutletDownloads("npm", npm.getMonth(), npm.getQuarter(), npm.getYear(), npm.getAll()),
            new OutletDownloads("github", null, null, null, releases.getDownloads()),
            ...sourced,
        ];
    }
}
