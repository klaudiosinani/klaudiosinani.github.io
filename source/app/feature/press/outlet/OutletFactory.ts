import type { FeaturedPress } from "@app/feature/press/coverage/FeaturedPress";
import { Outlet } from "./Outlet";

export class OutletFactory {
    public create(featuredPressList: readonly FeaturedPress[]): Outlet[] {
        const outlets: Map<string, Outlet> = new Map<string, Outlet>();

        for (const featuredPress of featuredPressList) {
            if (!outlets.has(featuredPress.publisherName)) {
                outlets.set(
                    featuredPress.publisherName,
                    new Outlet(featuredPress.publisherName, featuredPress.publicationUrl)
                );
            }
        }

        return [...outlets.values()];
    }
}
