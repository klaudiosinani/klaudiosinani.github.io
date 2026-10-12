import { ROUTES } from "@app/configuration/route/Routes";

export class BreadcrumbTrailResolver {
    private readonly TRAILING_SLASHES: RegExp = /\/+$/;
    private readonly LEADING_SLASH: RegExp = /^\//;

    public resolve(pathname: string): string[] {
        return pathname.replace(this.TRAILING_SLASHES, "").split("/").slice(1);
    }

    public address(segments: string[], index: number): string {
        return `/${segments.slice(0, index + 1).join("/")}/`;
    }

    public isTagName(segments: string[], index: number): boolean {
        return index > 0 && segments[0] === this.tagRoot();
    }

    private tagRoot(): string {
        return ROUTES.tags.replace(this.LEADING_SLASH, "");
    }
}
