import type { StructuredData } from "./StructuredData";

export interface BlogPostingDetails {
  readonly headline: string;
  readonly image: string;
  readonly author: string;
  readonly profile: string;
  readonly pubDatetime?: Date;
  readonly modDatetime?: Date | null;
}

export class BlogPostingSchemaBuilder {
  private static readonly CONTEXT = "https://schema.org";

  public static build({
    headline,
    image,
    author,
    profile,
    pubDatetime,
    modDatetime,
  }: BlogPostingDetails): StructuredData {
    return {
      "@context": BlogPostingSchemaBuilder.CONTEXT,
      "@type": "BlogPosting",
      headline: `${headline}`,
      image: `${image}`,
      datePublished: `${pubDatetime?.toISOString()}`,
      ...(modDatetime && { dateModified: modDatetime.toISOString() }),
      author: [
        {
          "@type": "Person",
          name: `${author}`,
          url: `${profile}`,
        },
      ],
    };
  }
}
