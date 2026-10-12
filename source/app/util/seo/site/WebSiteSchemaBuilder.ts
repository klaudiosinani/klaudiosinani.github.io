import type { WebSiteDetails } from "./WebSiteDetails";
import type { StructuredData } from "../StructuredData";

export class WebSiteSchemaBuilder {
    private readonly CONTEXT: string = "https://schema.org";

    public build({ name, url, description, searchUrl, id, publisherId, inLanguage }: WebSiteDetails): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "WebSite",
            ...(id ? { "@id": id } : {}),
            name,
            url,
            description,
            ...(inLanguage ? { inLanguage } : {}),
            ...(publisherId ? { publisher: { "@id": publisherId } } : {}),
            ...(searchUrl
                ? {
                      potentialAction: {
                          "@type": "SearchAction",
                          target: {
                              "@type": "EntryPoint",
                              urlTemplate: searchUrl,
                          },
                          "query-input": "required name=query",
                      },
                  }
                : {}),
        };
    }
}
