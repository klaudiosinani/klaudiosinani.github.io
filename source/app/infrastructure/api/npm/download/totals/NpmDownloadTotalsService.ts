import type { NpmDownloadApiService } from "../NpmDownloadApiService.ts";
import type { NpmDownloadCount } from "../count/NpmDownloadCount.ts";
import type { NpmDownloadCountGrouper } from "../count/NpmDownloadCountGrouper.ts";
import type { NpmDownloadDateRange } from "../request/NpmDownloadDateRange.ts";
import type { NpmDownloadDateRangeFactory } from "../request/NpmDownloadDateRangeFactory.ts";
import type { NpmDownloadTotals } from "./NpmDownloadTotals.ts";
import type { NpmDownloadTotalsCalculator } from "./NpmDownloadTotalsCalculator.ts";
import type { NpmDownloadTotalsFactory } from "./NpmDownloadTotalsFactory.ts";

export class NpmDownloadTotalsService {
    private readonly npmDownloadApiService: NpmDownloadApiService;
    private readonly npmDownloadDateRangeFactory: NpmDownloadDateRangeFactory;
    private readonly npmDownloadCountGrouper: NpmDownloadCountGrouper;
    private readonly npmDownloadTotalsCalculator: NpmDownloadTotalsCalculator;
    private readonly npmDownloadTotalsFactory: NpmDownloadTotalsFactory;

    public constructor(
        npmDownloadApiService: NpmDownloadApiService,
        npmDownloadDateRangeFactory: NpmDownloadDateRangeFactory,
        npmDownloadCountGrouper: NpmDownloadCountGrouper,
        npmDownloadTotalsCalculator: NpmDownloadTotalsCalculator,
        npmDownloadTotalsFactory: NpmDownloadTotalsFactory
    ) {
        this.npmDownloadApiService = npmDownloadApiService;
        this.npmDownloadDateRangeFactory = npmDownloadDateRangeFactory;
        this.npmDownloadCountGrouper = npmDownloadCountGrouper;
        this.npmDownloadTotalsCalculator = npmDownloadTotalsCalculator;
        this.npmDownloadTotalsFactory = npmDownloadTotalsFactory;
    }

    public async getTotals(packageNames: string[], today: Date): Promise<NpmDownloadTotals> {
        if (packageNames.length === 0) {
            return this.npmDownloadTotalsFactory.createEmpty();
        }

        const daily: NpmDownloadCount[] = this.npmDownloadCountGrouper.groupByDay(
            await this.readDownloadCounts(packageNames, [this.npmDownloadDateRangeFactory.createYear(today)])
        );

        const monthly: NpmDownloadCount[] = this.npmDownloadCountGrouper.groupByMonth(
            await this.readDownloadCounts(packageNames, this.npmDownloadDateRangeFactory.createHistory(today))
        );

        return this.npmDownloadTotalsCalculator.calculate(daily, monthly);
    }

    public async getTotalsByPackage(packageNames: string[], today: Date): Promise<Map<string, NpmDownloadTotals>> {
        const totalsByPackage: Map<string, NpmDownloadTotals> = new Map<string, NpmDownloadTotals>();

        if (packageNames.length === 0) {
            return totalsByPackage;
        }

        const yearRanges: NpmDownloadDateRange[] = [this.npmDownloadDateRangeFactory.createYear(today)];
        const historyRanges: NpmDownloadDateRange[] = this.npmDownloadDateRangeFactory.createHistory(today);

        const yearCounts: Map<string, NpmDownloadCount[]> = await this.readDownloadCountsByPackage(
            packageNames,
            yearRanges
        );
        const historyCounts: Map<string, NpmDownloadCount[]> = await this.readDownloadCountsByPackage(
            packageNames,
            historyRanges
        );

        packageNames.forEach((packageName: string) => {
            const daily: NpmDownloadCount[] = this.npmDownloadCountGrouper.groupByDay(
                yearCounts.get(packageName) ?? []
            );
            const monthly: NpmDownloadCount[] = this.npmDownloadCountGrouper.groupByMonth(
                historyCounts.get(packageName) ?? []
            );

            totalsByPackage.set(packageName, this.npmDownloadTotalsCalculator.calculate(daily, monthly));
        });

        return totalsByPackage;
    }

    private async readDownloadCountsByPackage(
        packageNames: string[],
        npmDownloadDateRanges: NpmDownloadDateRange[]
    ): Promise<Map<string, NpmDownloadCount[]>> {
        const npmDownloadCountsByPackage: Map<string, NpmDownloadCount[]> = new Map<string, NpmDownloadCount[]>();

        for (const npmDownloadDateRange of npmDownloadDateRanges) {
            const rangeCounts: Map<string, NpmDownloadCount[]> = await this.npmDownloadApiService.getDownloadCounts(
                packageNames,
                npmDownloadDateRange
            );

            rangeCounts.forEach((packageCounts: NpmDownloadCount[], packageName: string) => {
                const held: NpmDownloadCount[] = npmDownloadCountsByPackage.get(packageName) ?? [];

                npmDownloadCountsByPackage.set(packageName, [...held, ...packageCounts]);
            });
        }

        return npmDownloadCountsByPackage;
    }

    private async readDownloadCounts(
        packageNames: string[],
        npmDownloadDateRanges: NpmDownloadDateRange[]
    ): Promise<NpmDownloadCount[]> {
        const npmDownloadCounts: NpmDownloadCount[] = [];

        for (const npmDownloadDateRange of npmDownloadDateRanges) {
            const npmDownloadCountsByPackage: Map<string, NpmDownloadCount[]> =
                await this.npmDownloadApiService.getDownloadCounts(packageNames, npmDownloadDateRange);

            npmDownloadCountsByPackage.forEach((packageCounts: NpmDownloadCount[]) =>
                npmDownloadCounts.push(...packageCounts)
            );
        }

        return npmDownloadCounts;
    }
}
