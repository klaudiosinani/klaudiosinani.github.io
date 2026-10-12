import type { RetrievalService } from "@app/infrastructure/common/RetrievalService";
import type { ContentCollectionService } from "@app/infrastructure/content/ContentCollectionService";
import type { FeaturedSoftware } from "./FeaturedSoftware";

export class FeaturedSoftwareRetrievalService implements RetrievalService<FeaturedSoftware> {
    private readonly contentCollectionService: ContentCollectionService;

    public constructor(contentCollectionService: ContentCollectionService) {
        this.contentCollectionService = contentCollectionService;
    }

    public async retrieve(): Promise<FeaturedSoftware[]> {
        return this.contentCollectionService.getData("software");
    }
}
