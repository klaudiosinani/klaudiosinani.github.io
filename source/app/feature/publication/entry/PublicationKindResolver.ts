import type { SlugFormatter } from "@app/util/text/SlugFormatter";

export class PublicationKindResolver {
    private readonly WHITE_PAPER: string = "white-paper";
    private readonly RELEASE: string = "release";

    private readonly slugFormatter: SlugFormatter;

    public constructor(slugFormatter: SlugFormatter) {
        this.slugFormatter = slugFormatter;
    }

    public resolve(tags: string[]): string {
        const slugs: string[] = this.slugFormatter.formatAll(tags);

        if (slugs.includes(this.WHITE_PAPER)) {
            return "White paper";
        }

        if (slugs.includes(this.RELEASE)) {
            return "Release";
        }

        return "Article";
    }
}
