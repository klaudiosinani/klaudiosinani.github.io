import type { PersonDetails } from "./PersonDetails";
import type { StructuredData } from "../StructuredData";

export class PersonSchemaBuilder {
    private readonly CONTEXT: string = "https://schema.org";

    public reference({ id, name, url }: { id: string; name: string; url: string }): StructuredData {
        return { "@type": "Person", "@id": id, name, url };
    }

    public build({
        name,
        url,
        description,
        sameAs,
        jobTitle,
        id,
        givenName,
        familyName,
        alternateName,
        knowsAbout,
        image,
        worksFor,
    }: PersonDetails): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "Person",
            ...(id ? { "@id": id } : {}),
            name,
            ...(givenName ? { givenName } : {}),
            ...(familyName ? { familyName } : {}),
            ...(alternateName ? { alternateName } : {}),
            url,
            description,
            ...(jobTitle ? { jobTitle } : {}),
            ...(image ? { image } : {}),
            ...(worksFor
                ? {
                      worksFor: {
                          "@type": "Organization",
                          name: worksFor.name,
                          ...(worksFor.url ? { url: worksFor.url } : {}),
                      },
                  }
                : {}),
            ...(knowsAbout !== undefined && knowsAbout.length > 0 ? { knowsAbout: [...knowsAbout] } : {}),
            ...(sameAs.length > 0 ? { sameAs: [...sameAs] } : {}),
        };
    }
}
