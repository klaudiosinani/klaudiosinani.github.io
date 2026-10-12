import type { Outlet } from "./Outlet";

export class OutletDownloads {
    private readonly outlet: Outlet;
    private readonly month: number | null;
    private readonly quarter: number | null;
    private readonly year: number | null;
    private readonly all: number | null;

    public constructor(
        outlet: Outlet,
        month: number | null,
        quarter: number | null,
        year: number | null,
        all: number | null
    ) {
        this.outlet = outlet;
        this.month = month;
        this.quarter = quarter;
        this.year = year;
        this.all = all;
    }

    public getOutlet(): Outlet {
        return this.outlet;
    }
    public getMonth(): number | null {
        return this.month;
    }
    public getQuarter(): number | null {
        return this.quarter;
    }
    public getYear(): number | null {
        return this.year;
    }
    public getAll(): number | null {
        return this.all;
    }
}
