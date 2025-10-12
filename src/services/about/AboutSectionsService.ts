import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

const COLLECTION_NAME = "about";

export class AboutSectionsService {
  public async retrieveAboutSections(): Promise<CollectionEntry<"about">[]> {
    const sections = await getCollection(
      COLLECTION_NAME,
      ({ data }) => !data.draft
    );

    return sections.sort((x, y) => x.data.order - y.data.order);
  }
}

export const aboutSectionsService = new AboutSectionsService();
