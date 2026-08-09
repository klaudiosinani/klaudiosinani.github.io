import { ROUTES } from "@config/routes";

export class BreadcrumbTrailResolver {
  private static readonly TRAILING_SLASHES = /\/+$/;
  private static readonly LEADING_SLASH = /^\//;

  public static resolve(pathname: string): string[] {
    return pathname
      .replace(BreadcrumbTrailResolver.TRAILING_SLASHES, "")
      .split("/")
      .slice(1);
  }

  public static isTagName(segments: string[], index: number): boolean {
    return index > 0 && segments[0] === BreadcrumbTrailResolver.tagRoot();
  }

  private static tagRoot(): string {
    return ROUTES.tags.replace(BreadcrumbTrailResolver.LEADING_SLASH, "");
  }
}
