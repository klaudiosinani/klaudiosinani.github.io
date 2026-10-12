import type { SlugFormatter } from "@app/util/text/SlugFormatter";
import type { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration";
import type { CollectionEntry } from "astro:content";
import type { SectorKey } from "@app/configuration/sector/SectorKey";
import { Tag } from "./tag/Tag";

type Publication = CollectionEntry<"blog">;

export class PublicationQueryService {
    private readonly slugFormatter: SlugFormatter;
    private readonly publicationConfiguration: PublicationConfiguration;

    public constructor(slugFormatter: SlugFormatter, publicationConfiguration: PublicationConfiguration) {
        this.slugFormatter = slugFormatter;
        this.publicationConfiguration = publicationConfiguration;
    }
    public isPublished({ data }: Publication): boolean {
        const isPublishTimePassed: boolean =
            Date.now() >
            new Date(data.pubDatetime).getTime() - this.publicationConfiguration.getScheduledMarginInMilliseconds();

        return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
    }

    public sortByDate(publications: Publication[]): Publication[] {
        return publications
            .filter((publication: CollectionEntry<"blog">) => this.isPublished(publication))
            .sort(
                (first: CollectionEntry<"blog">, second: CollectionEntry<"blog">) =>
                    this.timestampOf(second) - this.timestampOf(first)
            );
    }

    public findByTag(publications: Publication[], tag: string): Publication[] {
        return this.sortByDate(
            publications.filter((publication: CollectionEntry<"blog">) =>
                this.slugFormatter.formatAll(publication.data.tags).includes(tag)
            )
        );
    }

    public findBySector(publications: Publication[], sectorKey: SectorKey): Publication[] {
        return this.sortByDate(
            publications.filter((publication: CollectionEntry<"blog">) => publication.data.sector === sectorKey)
        );
    }

    public collectTags(publications: Publication[]): Tag[] {
        const counted: Map<string, Tag> = new Map();

        publications
            .filter((publication: CollectionEntry<"blog">) => this.isPublished(publication))
            .flatMap((publication: CollectionEntry<"blog">) => publication.data.tags)
            .forEach((tagName: string) => {
                const tag: string = this.slugFormatter.format(tagName);
                const held: Tag | undefined = counted.get(tag);

                counted.set(tag, new Tag(tag, held?.getTagName() ?? tagName, (held?.getCount() ?? 0) + 1));
            });

        return [...counted.values()].sort((first: Tag, second: Tag) => first.getTag().localeCompare(second.getTag()));
    }

    private timestampOf({ data }: Publication): number {
        return new Date(data.modDatetime ?? data.pubDatetime).getTime();
    }
}
