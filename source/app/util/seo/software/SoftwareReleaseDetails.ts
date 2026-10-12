export interface SoftwareReleaseDetails {
    name: string;
    version: string;
    url: string;
    releaseNotes: string;
    datePublished: string;
    author: string;
    authorUrl: string;
    authorId?: string;
    downloadUrl?: string | null;
    programmingLanguage?: readonly string[];
    image?: string;
}
