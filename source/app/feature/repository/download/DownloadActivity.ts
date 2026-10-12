export class DownloadActivity {
    private readonly POPULATED: number = 0.5;

    public isPlottable(trend: readonly number[]): boolean {
        if (trend.length === 0) {
            return false;
        }

        const active: number = trend.filter((count: number) => count > 0).length;

        return active / trend.length >= this.POPULATED;
    }
}
