import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { CollectionPageDetails } from "./CollectionPageDetails";
import type { CollectionItem } from "./CollectionItem";
import type { StructuredData } from "../StructuredData";

export class CollectionPageSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({
        name,
        url,
        description,
        items,
        author,
        image,
        inLanguage,
        siteId,
        dateModified,
    }: CollectionPageDetails): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "CollectionPage",
            name,
            url,
            description,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            ...(image ? { image } : {}),
            ...(inLanguage ? { inLanguage } : {}),
            ...(dateModified ? { dateModified } : {}),
            ...(siteId ? { isPartOf: { "@id": siteId } } : {}),
            ...(author
                ? {
                      author: author.id
                          ? this.personSchemaBuilder.reference({
                                id: author.id,
                                name: author.name,
                                url: author.url,
                            })
                          : { "@type": "Person", name: author.name, url: author.url },
                  }
                : {}),
            mainEntity: {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((item: CollectionItem, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.getName(),
                    url: item.getUrl(),
                })),
            },
        };
    }
}
