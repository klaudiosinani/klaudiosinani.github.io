import { BreadcrumbStep } from "./BreadcrumbStep";
import type { TrailStep } from "@app/util/routing/TrailStep";

export class BreadcrumbStepsFactory {
    public create(trail: readonly TrailStep[], home: string, site: string): BreadcrumbStep[] {
        return [
            new BreadcrumbStep(home, site),
            ...trail.map(
                (trailStep: TrailStep) =>
                    new BreadcrumbStep(trailStep.getName(), new URL(trailStep.getHref(), site).href)
            ),
        ];
    }
}
