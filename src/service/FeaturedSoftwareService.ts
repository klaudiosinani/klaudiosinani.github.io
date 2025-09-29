import { getCollection } from "astro:content";
import type { FeaturedSoftware } from "./FeaturedSoftware";

export class FeaturedSoftwareService {
  public async retrieveFeaturedSoftware(): Promise<FeaturedSoftware[]> {
    const projects = await getCollection("software");

    return projects
      .map(project => ({
        name: project.data.name,
        logline: project.data.logline,
        metadata: project.data.metadata,
        description: project.data.description,
        url: project.data.url,
        order: project.data.order,
      }))
      .sort((x, y) => x.order - y.order);
  }
}

export const featuredSoftwareService = new FeaturedSoftwareService();
