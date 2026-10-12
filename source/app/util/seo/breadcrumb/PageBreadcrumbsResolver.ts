import { BreadcrumbStep } from "./BreadcrumbStep";

export class PageBreadcrumbsResolver {
    private readonly SEPARATORS: RegExp = /[-_]+/g;

    public resolve(pathname: string, site: string, homeName: string): BreadcrumbStep[] {
        const segments: string[] = pathname.split("/").filter((segment: string) => segment.length > 0);

        if (segments.length === 0) {
            return [];
        }

        const steps: BreadcrumbStep[] = [new BreadcrumbStep(homeName, new URL("/", site).href)];

        segments.forEach((segment: string, index: number) => {
            const path: string = `/${segments.slice(0, index + 1).join("/")}/`;

            steps.push(new BreadcrumbStep(this.name(segment), new URL(path, site).href));
        });

        return steps;
    }

    private name(segment: string): string {
        const words: string = decodeURIComponent(segment).replace(this.SEPARATORS, " ");

        return words.charAt(0).toUpperCase() + words.slice(1);
    }
}
