export interface BlogPostingDetails {
    readonly headline: string;
    readonly image: string;
    readonly author: string;
    readonly profile: string;
    readonly authorId?: string;
    readonly pubDatetime?: Date;
    readonly modDatetime?: Date | null;
    readonly description?: string;
    readonly url?: string;
    readonly keywords?: readonly string[];
    readonly wordCount?: number;
    readonly inLanguage?: string;
}
