import type { TitledContentEntry } from "../entry/TitledContentEntry.ts";
import type { RenderedContent } from "./RenderedContent.ts";
import { RenderedSection } from "./RenderedSection.ts";

export class RenderedSectionMapper {
    public map(titledContentEntry: TitledContentEntry, renderedContent: RenderedContent): RenderedSection {
        const href: string | undefined = this.resolveHref(titledContentEntry);

        return new RenderedSection(titledContentEntry.data.title, renderedContent, href);
    }

    private resolveHref(titledContentEntry: TitledContentEntry): string | undefined {
        return "href" in titledContentEntry.data ? titledContentEntry.data.href : undefined;
    }
}
