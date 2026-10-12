import type { MetricDelta } from "./MetricDelta";

export class MetricDeltaPhraser {
    private readonly SIGN: RegExp = /^[+−-]/;

    public phrase(metricDelta: MetricDelta): string {
        return `${metricDelta.getDirection()} ${metricDelta.getText().replace(this.SIGN, "")}`;
    }
}
