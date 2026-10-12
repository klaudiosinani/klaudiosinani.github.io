import type { BreadcrumbStep } from "./BreadcrumbStep";
import type { StructuredData } from "../StructuredData";

export class BreadcrumbListSchemaBuilder {
    private readonly CONTEXT: string = "https://schema.org";

    public build(steps: readonly BreadcrumbStep[]): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "BreadcrumbList",
            itemListElement: steps.map((step: BreadcrumbStep, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                name: step.getName(),
                item: step.getUrl(),
            })),
        };
    }
}
