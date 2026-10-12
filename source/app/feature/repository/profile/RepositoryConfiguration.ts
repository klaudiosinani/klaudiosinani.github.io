export class RepositoryConfiguration {
    public readonly EXCLUDED: readonly string[] = [
        "404",
        "about",
        "activity",
        "all",
        "index",
        "og",
        "press",
        "publications",
        "releases",
        "robots",
        "rss",
        "search",
        "sitemap",
        "sitemap-index",
        "software",
        "thanks",
    ];

    public profiles(name: string): boolean {
        return !name.includes(".") && !this.EXCLUDED.includes(name.toLowerCase());
    }
}
