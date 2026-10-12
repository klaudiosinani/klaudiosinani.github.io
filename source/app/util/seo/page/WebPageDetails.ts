export interface WebPageDetails {
    name: string;
    url: string;
    description: string;
    author: { name: string; url: string; id?: string };
    site: { name: string; url: string };
    image?: string;
    inLanguage?: string;
}
