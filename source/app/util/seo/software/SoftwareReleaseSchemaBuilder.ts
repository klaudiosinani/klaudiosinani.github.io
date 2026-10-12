import type { PersonSchemaBuilder } from "@app/util/seo/site/PersonSchemaBuilder";
import type { SoftwareReleaseDetails } from "./SoftwareReleaseDetails";
import type { StructuredData } from "../StructuredData";

export class SoftwareReleaseSchemaBuilder {
    private readonly personSchemaBuilder: PersonSchemaBuilder;
    private readonly CONTEXT: string = "https://schema.org";
    private readonly NOTES: number = 5_000;

    public constructor(personSchemaBuilder: PersonSchemaBuilder) {
        this.personSchemaBuilder = personSchemaBuilder;
    }

    public build({
        name,
        version,
        url,
        releaseNotes,
        datePublished,
        author,
        authorUrl,
        authorId,
        downloadUrl,
        programmingLanguage,
        image,
    }: SoftwareReleaseDetails): StructuredData {
        const person: StructuredData = authorId
            ? this.personSchemaBuilder.reference({
                  id: authorId,
                  name: author,
                  url: authorUrl,
              })
            : { "@type": "Person", name: author, url: authorUrl };

        return {
            "@context": this.CONTEXT,
            "@type": "SoftwareApplication",
            name: `${name} ${version}`,
            softwareVersion: version,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            ...(image ? { image } : {}),
            releaseNotes: releaseNotes.slice(0, this.NOTES),
            datePublished,
            applicationCategory: "DeveloperApplication",
            isAccessibleForFree: true,
            author: person,
            maintainer: person,
            ...(programmingLanguage !== undefined && programmingLanguage.length > 0
                ? { programmingLanguage: [...programmingLanguage] }
                : {}),
            ...(downloadUrl ? { downloadUrl } : {}),
        };
    }
}
