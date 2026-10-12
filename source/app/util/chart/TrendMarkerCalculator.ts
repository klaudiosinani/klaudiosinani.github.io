import type { TrendPoint } from "@app/util/chart/TrendPoint";

export class TrendMarkerCalculator {
    private readonly PLACES: number = 3;

    public compute(end: TrendPoint | null, width: number, height: number): string | null {
        if (!end) {
            return null;
        }

        const left: string = this.percent(end.getX(), width);
        const top: string = this.percent(end.getY(), height);

        return `left:${left}%;top:${top}%`;
    }

    private percent(value: number, extent: number): string {
        return ((value / extent) * 100).toFixed(this.PLACES);
    }
}
