import { rm, writeFile } from "node:fs/promises";
import { AUTHOR_PORTRAIT } from "@app/configuration/author/AuthorPortraits";

export class PortraitDownloadService {
    private readonly USER_AGENT: string = "Mozilla/5.0";

    private readonly directory: string;

    public constructor(directory: string) {
        this.directory = directory;
    }

    public async store(): Promise<string | null> {
        const response: Response = await fetch(AUTHOR_PORTRAIT.getSource(), {
            headers: { "User-Agent": this.USER_AGENT },
        });

        if (!response.ok) {
            return null;
        }

        const mediaType: string = this.resolveMediaType(response);
        const ending: string | undefined = AUTHOR_PORTRAIT.resolveEnding(mediaType);

        if (ending === undefined) {
            return null;
        }

        await this.removeHeldPortraits();
        await this.write(ending, response);

        return this.at(ending);
    }

    private async removeHeldPortraits(): Promise<void> {
        for (const held of AUTHOR_PORTRAIT.getEndings()) {
            const path: string = `${this.directory}${this.at(held)}`;

            await rm(path, { force: true });
        }
    }

    private async write(ending: string, response: Response): Promise<void> {
        const path: string = `${this.directory}${this.at(ending)}`;
        const body: ArrayBuffer = await response.arrayBuffer();
        const bytes: Uint8Array = new Uint8Array(body);

        await writeFile(path, bytes);
    }

    private resolveMediaType(response: Response): string {
        const contentType: string = response.headers.get("content-type") ?? "";
        const mediaType: string = contentType.split(";")[0];

        return mediaType.trim().toLowerCase();
    }

    private at(ending: string): string {
        return AUTHOR_PORTRAIT.resolvePath(ending);
    }
}
