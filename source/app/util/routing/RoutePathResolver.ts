import { ROUTES } from "@app/configuration/route/Routes";

export class RoutePathResolver {
    private readonly SEGMENT_SEPARATOR: string = "/";

    public resolvePublication(slug: string): string {
        return `${this.join(ROUTES.publications, slug)}${this.SEGMENT_SEPARATOR}`;
    }

    public resolvePublicationImage(slug: string): string {
        return `${this.join(ROUTES.publications, slug)}.png`;
    }

    public resolveTag(tag: string): string {
        return this.join(ROUTES.tags, tag);
    }

    public resolveRepository(slug: string): string {
        return `${this.SEGMENT_SEPARATOR}${slug}${this.SEGMENT_SEPARATOR}`;
    }

    public resolveRepositoryImage(slug: string): string {
        return `${this.SEGMENT_SEPARATOR}${slug}.png`;
    }

    public resolvePageImage(key: string): string {
        return `${this.SEGMENT_SEPARATOR}og${this.SEGMENT_SEPARATOR}${key}.png`;
    }

    public resolveTagImage(tag: string): string {
        return this.resolvePageImage(this.tagImageKey(tag));
    }

    public tagImageKey(tag: string): string {
        return `tag-${tag}`;
    }

    public resolveContributions(repository: string): string {
        return `${this.resolveContributionsBase(repository)}${this.SEGMENT_SEPARATOR}`;
    }

    public resolveContributionsBase(repository: string): string {
        return this.join(ROUTES.experience, repository);
    }

    public resolveRepositoryReleases(slug: string): string {
        return `${this.resolveRepository(slug)}releases${this.SEGMENT_SEPARATOR}`;
    }

    public resolveRepositoryManual(slug: string): string {
        return `${this.resolveRepository(slug)}documentation${this.SEGMENT_SEPARATOR}`;
    }

    public resolveRepositoryDocument(slug: string, document: string): string {
        return `${this.resolveRepositoryManual(slug)}${document}${this.SEGMENT_SEPARATOR}`;
    }

    public resolveRelease(slug: string, tag: string): string {
        return `${this.resolveRepository(slug)}releases/${tag}${this.SEGMENT_SEPARATOR}`;
    }

    private join(route: string, segment: string): string {
        return `${route}${this.SEGMENT_SEPARATOR}${segment}`;
    }
}
