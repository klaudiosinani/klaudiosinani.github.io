import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { TechArticleDetails } from "./TechArticleDetails";
import type { StructuredData } from "../StructuredData";

export class TechArticleSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({
        headline,
        description,
        url,
        author,
        authorUrl,
        authorId,
        dateModified,
        inLanguage,
        about,
        image,
    }: TechArticleDetails): StructuredData {
        const person: StructuredData = authorId
            ? this.personSchemaBuilder.reference({
                  id: authorId,
                  name: author,
                  url: authorUrl,
              })
            : { "@type": "Person", name: author, url: authorUrl };

        return {
            "@context": this.CONTEXT,
            "@type": "TechArticle",
            headline,
            description,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            ...(image ? { image } : {}),
            author: person,
            publisher: person,
            ...(dateModified ? { dateModified } : {}),
            ...(inLanguage ? { inLanguage } : {}),
            ...(about
                ? {
                      about: {
                          "@type": "SoftwareSourceCode",
                          name: about.name,
                          url: about.url,
                      },
                  }
                : {}),
        };
    }
}
