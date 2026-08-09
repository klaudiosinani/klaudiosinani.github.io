import type { RetrievalService } from "@services/RetrievalService";
import { ContentRetrievalService } from "@services/content/ContentRetrievalService";
import type { FeaturedPress } from "./FeaturedPress";

export class FeaturedPressRetrievalService implements RetrievalService<FeaturedPress> {
  private static readonly COLLECTION_NAME = "press";

  private readonly contentRetrievalService: ContentRetrievalService;

  constructor(contentRetrievalService = new ContentRetrievalService()) {
    this.contentRetrievalService = contentRetrievalService;
  }

  public async retrieve(): Promise<FeaturedPress[]> {
    return this.contentRetrievalService.data(
      FeaturedPressRetrievalService.COLLECTION_NAME
    );
  }
}

export const featuredPressRetrievalService =
  new FeaturedPressRetrievalService();
