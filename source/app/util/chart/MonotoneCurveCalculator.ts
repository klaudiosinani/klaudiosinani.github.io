import { TrendPoint } from "./TrendPoint";

export class MonotoneCurveCalculator {
    private readonly LIMIT: number = 9;

    private readonly THIRD: number = 3;

    public compute(points: readonly TrendPoint[]): string {
        if (points.length < 2) {
            return "";
        }

        const slopes: number[] = this.slopes(points);
        const start: string = `M ${this.pair(points[0])}`;

        const curves: string[] = points.slice(1).map((point: TrendPoint, index: number) => {
            const previous: TrendPoint = points[index];
            const run: number = (point.getX() - previous.getX()) / this.THIRD;

            const first: TrendPoint = new TrendPoint(previous.getX() + run, previous.getY() + slopes[index] * run);
            const second: TrendPoint = new TrendPoint(point.getX() - run, point.getY() - slopes[index + 1] * run);

            return `C ${this.pair(first)} ${this.pair(second)} ${this.pair(point)}`;
        });

        return [start, ...curves].join(" ");
    }

    private slopes(points: readonly TrendPoint[]): number[] {
        const deltas: number[] = points.slice(1).map((point: TrendPoint, index: number) => {
            const previous: TrendPoint = points[index];

            return (point.getY() - previous.getY()) / (point.getX() - previous.getX());
        });

        const slopes: number[] = points.map((_point: TrendPoint, index: number) => {
            if (index === 0) {
                return deltas[0];
            }

            if (index === points.length - 1) {
                return deltas[deltas.length - 1];
            }

            if (deltas[index - 1] * deltas[index] <= 0) {
                return 0;
            }

            return (deltas[index - 1] + deltas[index]) / 2;
        });

        return this.limited(slopes, deltas);
    }

    private limited(slopes: number[], deltas: number[]): number[] {
        const limited: number[] = [...slopes];

        deltas.forEach((delta: number, index: number) => {
            if (delta === 0) {
                limited[index] = 0;
                limited[index + 1] = 0;
                return;
            }

            const alpha: number = limited[index] / delta;
            const beta: number = limited[index + 1] / delta;
            const distance: number = alpha * alpha + beta * beta;

            if (distance > this.LIMIT) {
                const scale: number = this.THIRD / Math.sqrt(distance);

                limited[index] = scale * alpha * delta;
                limited[index + 1] = scale * beta * delta;
            }
        });

        return limited;
    }

    private pair(point: TrendPoint): string {
        return `${point.getX().toFixed(2)} ${point.getY().toFixed(2)}`;
    }
}
