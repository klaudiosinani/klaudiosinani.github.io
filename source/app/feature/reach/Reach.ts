import type { MetricDelta } from "@app/feature/impact/change/MetricDelta";

export class Reach {
    private readonly downloadsAllTime: number;
    private readonly downloadsLastMonth: number;
    private readonly downloadsLastYear: number;
    private readonly monthChange: MetricDelta | null;
    private readonly stars: number;
    private readonly repositories: number;
    private readonly dependentRepositories: number | null;
    private readonly views: number | null;
    private readonly uniqueVisitors: number | null;

    public constructor(
        downloadsAllTime: number,
        downloadsLastMonth: number,
        downloadsLastYear: number,
        monthChange: MetricDelta | null,
        stars: number,
        repositories: number,
        dependentRepositories: number | null,
        views: number | null,
        uniqueVisitors: number | null
    ) {
        this.downloadsAllTime = downloadsAllTime;
        this.downloadsLastMonth = downloadsLastMonth;
        this.downloadsLastYear = downloadsLastYear;
        this.monthChange = monthChange;
        this.stars = stars;
        this.repositories = repositories;
        this.dependentRepositories = dependentRepositories;
        this.views = views;
        this.uniqueVisitors = uniqueVisitors;
    }

    public getDownloadsAllTime(): number {
        return this.downloadsAllTime;
    }

    public getDownloadsLastMonth(): number {
        return this.downloadsLastMonth;
    }

    public getDownloadsLastYear(): number {
        return this.downloadsLastYear;
    }

    public getMonthChange(): MetricDelta | null {
        return this.monthChange;
    }

    public getStars(): number {
        return this.stars;
    }

    public getRepositories(): number {
        return this.repositories;
    }

    public getDependentRepositories(): number | null {
        return this.dependentRepositories;
    }

    public getViews(): number | null {
        return this.views;
    }

    public getUniqueVisitors(): number | null {
        return this.uniqueVisitors;
    }
}
