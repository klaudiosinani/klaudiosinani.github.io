export class ReleaseSlugFormatter {
    public readonly LATEST: string = "latest";

    public format(tag: string): string {
        return tag
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9.]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    public isReserved(tag: string): boolean {
        return this.format(tag) === this.LATEST;
    }
}
