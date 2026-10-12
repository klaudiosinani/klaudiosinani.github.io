export class TrafficMetrics {
    private readonly views: number;
    private readonly uniqueVisitors: number;
    private readonly clones: number;

    public constructor(views: number, uniqueVisitors: number, clones: number) {
        this.views = views;
        this.uniqueVisitors = uniqueVisitors;
        this.clones = clones;
    }

    public getViews(): number {
        return this.views;
    }
    public getUniqueVisitors(): number {
        return this.uniqueVisitors;
    }
    public getClones(): number {
        return this.clones;
    }
}
