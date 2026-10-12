import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { WebPageDetails } from "./WebPageDetails";
import type { StructuredData } from "../StructuredData";

export class WebPageSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({ name, url, description, author, site, image, inLanguage }: WebPageDetails): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "WebPage",
            name,
            url,
            description,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            ...(image ? { image } : {}),
            ...(inLanguage ? { inLanguage } : {}),
            author: author.id
                ? this.personSchemaBuilder.reference({
                      id: author.id,
                      name: author.name,
                      url: author.url,
                  })
                : { "@type": "Person", name: author.name, url: author.url },
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        };
    }
}
