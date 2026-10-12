export interface SoftwareSourceCodeDetails {
    name: string;
    description: string;
    url: string;
    codeRepository: string;
    programmingLanguage: readonly string[];
    author: string;
    authorUrl: string;
    authorId?: string;
    stars?: number;
    license?: string;
    version?: string | null;
    dateCreated?: string;
    dateModified?: string;
    keywords?: readonly string[];
    image?: string;
    downloadUrl?: string | null;
}
