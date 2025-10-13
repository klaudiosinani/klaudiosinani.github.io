import { getCollection } from "astro:content";
import type { FeaturedPress } from "./FeaturedPress";

export class FeaturedPressService {
  public async retrieveFeaturedPress(): Promise<FeaturedPress[]> {
    const projects = await getCollection("press");

    return projects
      .map(project => ({
        publicationTitle: project.data.publicationTitle,
        issueNumber: project.data.issueNumber,
        publisherName: project.data.publisherName,
        publicationUrl: project.data.publicationUrl,
        softwareTitle: project.data.softwareTitle,
        softwareRepositoryUrl: project.data.softwareRepositoryUrl,
        hidden: project.data.hidden,
        order: project.data.order,
      }))
      .sort((x, y) => x.order - y.order);
  }
}

export const featuredPressService = new FeaturedPressService();
