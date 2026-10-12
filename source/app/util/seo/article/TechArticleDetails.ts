export interface TechArticleDetails {
    headline: string;
    description: string;
    url: string;
    author: string;
    authorUrl: string;
    authorId?: string;
    dateModified?: string;
    inLanguage?: string;
    about?: { name: string; url: string };
    image?: string;
}
