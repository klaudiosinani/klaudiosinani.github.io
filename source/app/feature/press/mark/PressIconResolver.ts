export class PressIconResolver {
    private readonly PATH: string = "/press/icons";
    private readonly TYPE: string = ".png";

    private readonly directory: string;

    public constructor(directory: string) {
        this.directory = directory;
    }

    public async resolve(host: string): Promise<string | null> {
        const { access } = await import("node:fs/promises");
        const file: string = `${host}${this.TYPE}`;

        try {
            await access(`${this.directory}/${file}`);
        } catch {
            return null;
        }

        return `${this.PATH}/${file}`;
    }
}
