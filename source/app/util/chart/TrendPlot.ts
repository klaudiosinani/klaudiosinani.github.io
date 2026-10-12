import type { TrendPoint } from "./TrendPoint";

export class TrendPlot {
    private readonly line: string;
    private readonly area: string;
    private readonly end: TrendPoint | null;

    public constructor(line: string, area: string, end: TrendPoint | null) {
        this.line = line;
        this.area = area;
        this.end = end;
    }

    public getLine(): string {
        return this.line;
    }

    public getArea(): string {
        return this.area;
    }

    public getEnd(): TrendPoint | null {
        return this.end;
    }
}
