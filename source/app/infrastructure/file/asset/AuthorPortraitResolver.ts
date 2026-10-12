import { AUTHOR_PORTRAIT } from "@app/configuration/author/AuthorPortraits";
import type { PublicAssetResolver } from "./PublicAssetResolver.ts";

export class AuthorPortraitResolver {
    private readonly publicAssetResolver: PublicAssetResolver;

    public constructor(publicAssetResolver: PublicAssetResolver) {
        this.publicAssetResolver = publicAssetResolver;
    }

    public async resolve(): Promise<string | null> {
        for (const ending of AUTHOR_PORTRAIT.getEndings()) {
            const path: string = AUTHOR_PORTRAIT.resolvePath(ending);
            const held: string | null = await this.publicAssetResolver.resolve(path);

            if (held !== null) {
                return held;
            }
        }

        return null;
    }
}
