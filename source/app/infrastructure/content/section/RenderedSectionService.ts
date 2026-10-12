import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { ContentCollectionService } from "../ContentCollectionService.ts";
import type { TitledCollectionKey } from "../entry/TitledCollectionKey.ts";
import type { RenderedContent } from "./RenderedContent.ts";
import type { RenderedSection } from "./RenderedSection.ts";
import type { RenderedSectionMapper } from "./RenderedSectionMapper.ts";

export class RenderedSectionService {
    private readonly contentCollectionService: ContentCollectionService;
    private readonly renderedSectionMapper: RenderedSectionMapper;

    public constructor(
        contentCollectionService: ContentCollectionService,
        renderedSectionMapper: RenderedSectionMapper
    ) {
        this.contentCollectionService = contentCollectionService;
        this.renderedSectionMapper = renderedSectionMapper;
    }

    public async getSections<Key extends TitledCollectionKey>(collectionName: Key): Promise<RenderedSection[]> {
        const contentEntries: CollectionEntry<Key>[] = await this.contentCollectionService.getEntries(collectionName);

        return Promise.all(
            contentEntries.map((contentEntry: CollectionEntry<Key>) => this.renderSection(contentEntry))
        );
    }

    private async renderSection<Key extends TitledCollectionKey>(
        contentEntry: CollectionEntry<Key>
    ): Promise<RenderedSection> {
        const renderedEntry: Awaited<ReturnType<typeof render>> = await render(contentEntry);
        const renderedContent: RenderedContent = renderedEntry.Content;

        return this.renderedSectionMapper.map(contentEntry, renderedContent);
    }
}
