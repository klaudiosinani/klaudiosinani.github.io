import type { CollectionItem } from "./CollectionItem";
export interface CollectionPageDetails {
    name: string;
    url: string;
    description: string;
    items: readonly CollectionItem[];
    author?: { name: string; url: string; id?: string };
    image?: string;
    inLanguage?: string;
    siteId?: string;
    dateModified?: string;
}
