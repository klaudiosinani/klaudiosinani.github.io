export class ChartCurve {
    private readonly STEPS: number = 20;

    private readonly line: SVGPathElement;

    public constructor(line: SVGPathElement) {
        this.line = line;
    }

    public heightAt(across: number): number {
        const box: DOMRect = this.area();
        const length: number = this.line.getTotalLength();

        if (length === 0 || box.height === 0) {
            return 0;
        }

        const found: DOMPoint = this.pointAt(box.x + box.width * across, length);

        return 1 - (found.y - box.y) / box.height;
    }

    private area(): DOMRect {
        const view: SVGAnimatedRect | undefined = this.line.ownerSVGElement?.viewBox;

        if (!view || view.baseVal.height === 0) {
            return this.line.getBBox();
        }

        return new DOMRect(view.baseVal.x, view.baseVal.y, view.baseVal.width, view.baseVal.height);
    }

    private pointAt(wanted: number, length: number): DOMPoint {
        let low: number = 0;
        let high: number = length;

        for (let step: number = 0; step < this.STEPS; step += 1) {
            const middle: number = (low + high) / 2;

            if (this.line.getPointAtLength(middle).x < wanted) {
                low = middle;
            } else {
                high = middle;
            }
        }

        return this.line.getPointAtLength((low + high) / 2);
    }
}
