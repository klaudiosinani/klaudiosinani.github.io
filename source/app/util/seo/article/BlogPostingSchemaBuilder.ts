import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { BlogPostingDetails } from "./BlogPostingDetails";
import type { StructuredData } from "../StructuredData";

export class BlogPostingSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({
        headline,
        image,
        author,
        profile,
        authorId,
        pubDatetime,
        modDatetime,
        description,
        url,
        keywords,
        wordCount,
        inLanguage,
    }: BlogPostingDetails): StructuredData {
        const person: StructuredData = authorId
            ? this.personSchemaBuilder.reference({
                  id: authorId,
                  name: `${author}`,
                  url: `${profile}`,
              })
            : { "@type": "Person", name: `${author}`, url: `${profile}` };

        return {
            "@context": this.CONTEXT,
            "@type": "BlogPosting",
            headline: `${headline}`,
            image: `${image}`,
            datePublished: `${pubDatetime?.toISOString()}`,
            ...(modDatetime && { dateModified: modDatetime.toISOString() }),
            author: [person],
            publisher: person,
            ...(description ? { description } : {}),
            ...(url
                ? {
                      url,
                      mainEntityOfPage: { "@type": "WebPage", "@id": url },
                  }
                : {}),
            ...(keywords !== undefined && keywords.length > 0 ? { keywords: [...keywords] } : {}),
            ...(wordCount && wordCount > 0 ? { wordCount } : {}),
            ...(inLanguage ? { inLanguage } : {}),
        };
    }
}
