import type { CollectionEntry } from "astro:content";
import { SCHEDULED_POST_MARGIN } from "@config/content";
import { SlugFormatter } from "@utils/text/SlugFormatter";
import type { Tag } from "./Tag";

type Publication = CollectionEntry<"blog">;

export class PublicationQueryService {
  public static isPublished({ data }: Publication): boolean {
    const isPublishTimePassed =
      Date.now() > new Date(data.pubDatetime).getTime() - SCHEDULED_POST_MARGIN;

    return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
  }

  public static sortByDate(publications: Publication[]): Publication[] {
    return publications
      .filter(publication => PublicationQueryService.isPublished(publication))
      .sort(
        (first, second) =>
          PublicationQueryService.timestampOf(second) -
          PublicationQueryService.timestampOf(first)
      );
  }

  public static findByTag(
    publications: Publication[],
    tag: string
  ): Publication[] {
    return PublicationQueryService.sortByDate(
      publications.filter(publication =>
        SlugFormatter.formatAll(publication.data.tags).includes(tag)
      )
    );
  }

  public static collectTags(publications: Publication[]): Tag[] {
    return publications
      .filter(publication => PublicationQueryService.isPublished(publication))
      .flatMap(publication => publication.data.tags)
      .map(tagName => ({ tag: SlugFormatter.format(tagName), tagName }))
      .filter(
        (value, index, tags) =>
          tags.findIndex(candidate => candidate.tag === value.tag) === index
      )
      .sort((first, second) => first.tag.localeCompare(second.tag));
  }

  private static timestampOf({ data }: Publication): number {
    return new Date(data.modDatetime ?? data.pubDatetime).getTime();
  }
}
