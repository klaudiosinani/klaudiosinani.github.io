export class RepositoryNameResolver {
    private readonly TRAILING: RegExp = /\/+$/;
    private readonly SEPARATOR: string = "/";

    public resolve(url: string): string {
        const trimmed: string = url.replace(this.TRAILING, "");

        return trimmed.slice(trimmed.lastIndexOf(this.SEPARATOR) + 1).toLowerCase();
    }
}
