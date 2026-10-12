import type { StructuredData } from "../StructuredData";

export interface ProfilePageDetails {
    url: string;
    person: StructuredData;
    name?: string;
    siteId?: string;
    inLanguage?: string;
}
