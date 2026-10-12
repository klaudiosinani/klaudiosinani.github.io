import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { SoftwareSourceCodeDetails } from "./SoftwareSourceCodeDetails";
import type { StructuredData } from "../StructuredData";

export class SoftwareSourceCodeSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({
        name,
        description,
        url,
        codeRepository,
        programmingLanguage,
        author,
        authorUrl,
        authorId,
        stars,
        license,
        version,
        dateCreated,
        dateModified,
        keywords,
        image,
        downloadUrl,
    }: SoftwareSourceCodeDetails): StructuredData {
        const person: StructuredData = authorId
            ? this.personSchemaBuilder.reference({
                  id: authorId,
                  name: author,
                  url: authorUrl,
              })
            : { "@type": "Person", name: author, url: authorUrl };

        return {
            "@context": this.CONTEXT,
            "@type": "SoftwareSourceCode",
            name,
            description,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            codeRepository,
            applicationCategory: "DeveloperApplication",
            isAccessibleForFree: true,
            ...(programmingLanguage.length > 0 ? { programmingLanguage: [...programmingLanguage] } : {}),
            author: person,
            maintainer: person,
            ...(license ? { license } : {}),
            ...(version ? { softwareVersion: version } : {}),
            ...(dateCreated ? { dateCreated } : {}),
            ...(dateModified ? { dateModified } : {}),
            ...(keywords !== undefined && keywords.length > 0 ? { keywords: [...keywords] } : {}),
            ...(image ? { image } : {}),
            ...(downloadUrl ? { downloadUrl } : {}),
            ...(stars && stars > 0
                ? {
                      interactionStatistic: {
                          "@type": "InteractionCounter",
                          interactionType: "https://schema.org/LikeAction",
                          userInteractionCount: stars,
                      },
                  }
                : {}),
        };
    }
}
