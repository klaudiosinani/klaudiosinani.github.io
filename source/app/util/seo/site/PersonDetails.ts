export interface PersonDetails {
    name: string;
    url: string;
    description: string;
    sameAs: readonly string[];
    jobTitle?: string;
    id?: string;
    givenName?: string;
    familyName?: string;
    alternateName?: string;
    knowsAbout?: readonly string[];
    image?: string;
    worksFor?: { name: string; url?: string };
}
