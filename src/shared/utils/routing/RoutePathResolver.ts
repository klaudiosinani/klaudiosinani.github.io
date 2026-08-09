import { ROUTES } from "@config/routes";

export class RoutePathResolver {
  private static readonly SEGMENT_SEPARATOR = "/";

  public static resolvePublication(slug: string): string {
    return `${RoutePathResolver.join(ROUTES.publications, slug)}${RoutePathResolver.SEGMENT_SEPARATOR}`;
  }

  public static resolveTag(tag: string): string {
    return RoutePathResolver.join(ROUTES.tags, tag);
  }

  public static resolvePublicationImage(slug: string): string {
    return `${RoutePathResolver.join(ROUTES.publications, slug)}.png`;
  }

  private static join(route: string, segment: string): string {
    return `${route}${RoutePathResolver.SEGMENT_SEPARATOR}${segment}`;
  }
}
