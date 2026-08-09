import type { RetrievalService } from "@services/RetrievalService";
import { ContentRetrievalService } from "@services/content/ContentRetrievalService";
import type { FeaturedSoftware } from "./FeaturedSoftware";

export class FeaturedSoftwareRetrievalService implements RetrievalService<FeaturedSoftware> {
  private static readonly COLLECTION_NAME = "software";

  private readonly contentRetrievalService: ContentRetrievalService;

  constructor(contentRetrievalService = new ContentRetrievalService()) {
    this.contentRetrievalService = contentRetrievalService;
  }

  public async retrieve(): Promise<FeaturedSoftware[]> {
    return this.contentRetrievalService.data(
      FeaturedSoftwareRetrievalService.COLLECTION_NAME
    );
  }
}

export const featuredSoftwareRetrievalService =
  new FeaturedSoftwareRetrievalService();
