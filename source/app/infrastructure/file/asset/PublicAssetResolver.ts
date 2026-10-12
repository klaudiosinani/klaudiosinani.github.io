export class PublicAssetResolver {
    private readonly directory: string;

    public constructor(directory: string) {
        this.directory = directory;
    }

    public async resolve(path: string): Promise<string | null> {
        const { access } = await import("node:fs/promises");

        try {
            await access(`${this.directory}${path}`);
        } catch {
            return null;
        }

        return path;
    }
}
