import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService";
import type { FeaturedPress } from "./coverage/FeaturedPress";

export class FeaturedPressRetrievalService implements RetrievalService<FeaturedPress> {
    private readonly contentCollectionService: ContentCollectionService;

    public constructor(contentCollectionService: ContentCollectionService) {
        this.contentCollectionService = contentCollectionService;
    }

    public async retrieve(): Promise<FeaturedPress[]> {
        return this.contentCollectionService.getData("press");
    }
}
