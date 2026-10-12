import type { ProfilePageDetails } from "./ProfilePageDetails";
import type { StructuredData } from "../StructuredData";

export class ProfilePageSchemaBuilder {
    private readonly CONTEXT: string = "https://schema.org";

    public build({ url, person, name, siteId, inLanguage }: ProfilePageDetails): StructuredData {
        return {
            "@context": this.CONTEXT,
            "@type": "ProfilePage",
            url,
            ...(name ? { name } : {}),
            ...(inLanguage ? { inLanguage } : {}),
            ...(siteId ? { isPartOf: { "@id": siteId } } : {}),
            mainEntity: person,
        };
    }
}
