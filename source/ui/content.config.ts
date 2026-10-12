import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { SECTOR_KEYS } from "@app/configuration/sector/SectorKeys";
import { SITE } from "@app/configuration/site/Site";
import type { SchemaContext } from "astro/content/config";

const blog = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./source/ui/content/blog",
        generateId: ({ entry, data }: { entry: string; data: Record<string, unknown> }): string =>
            typeof data.slug === "string" && data.slug.length > 0 ? data.slug : entry.replace(/\.md$/, ""),
    }),
    schema: ({ image }: SchemaContext) =>
        z.object({
            author: z.string().default(SITE.getAuthor()),
            pubDatetime: z.date(),
            modDatetime: z.date().optional().nullable(),
            title: z.string(),
            featured: z.boolean().optional(),
            draft: z.boolean().optional(),
            tags: z.array(z.string()).default(["others"]),
            sector: z.enum(SECTOR_KEYS).default("open-source"),
            ogImage: image()
                .refine((img: { width: number; height: number }) => img.width >= 1200 && img.height >= 630, {
                    message: "OpenGraph image must be at least 1200 X 630 pixels!",
                })
                .or(z.string())
                .optional(),
            description: z.string(),
            canonicalURL: z.string().optional(),
            seoTitle: z.string().optional(),
        }),
});

const software = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./source/ui/content/software" }),
    schema: z.object({
        name: z.string(),
        logline: z.string(),
        description: z.string(),
        url: z.url(),
        order: z.number().default(99),
        sector: z.enum(SECTOR_KEYS).default("open-source"),
        featured: z.boolean().default(true),
        seoTitle: z.string().optional(),
    }),
});

const press = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./source/ui/content/press" }),
    schema: z.object({
        publicationTitle: z.string(),
        summary: z.string(),
        issueNumber: z.string(),
        publisherName: z.string(),
        publicationUrl: z.url(),
        softwareTitle: z.string(),
        softwareRepositoryUrl: z.url(),
        previewImage: z.string().optional(),
        hidden: z.boolean().default(false),
        order: z.number().default(99),
    }),
});

const about = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./source/ui/content/about" }),
    schema: z.object({
        title: z.string(),
        draft: z.boolean().default(false),
        order: z.number().default(99),
        href: z.string().optional(),
    }),
});

const thanks = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./source/ui/content/thanks" }),
    schema: z.object({
        title: z.string(),
        draft: z.boolean().default(false),
        order: z.number().default(99),
    }),
});

export const collections = { blog, software, press, about, thanks };
