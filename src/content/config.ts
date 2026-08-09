import { SITE } from "@config/site";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

const software = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/software" }),
  schema: z.object({
    name: z.string(),
    logline: z.string(),
    metadata: z.string(),
    description: z.string(),
    url: z.string().url(),
    order: z.number().default(99),
  }),
});

const press = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/press" }),
  schema: z.object({
    publicationTitle: z.string(),
    issueNumber: z.string(),
    publisherName: z.string(),
    publicationUrl: z.string().url(),
    softwareTitle: z.string(),
    softwareRepositoryUrl: z.string().url(),
    hidden: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const about = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const thanks = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.md", base: "./src/content/thanks" }),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { blog, software, press, about, thanks };
