import { SlugFormatter } from "@app/util/text/SlugFormatter.ts";
import { PublicationConfiguration } from "@app/feature/publication/PublicationConfiguration.ts";
import { PageOgAddressAssembler } from "@app/infrastructure/render/og/details/PageOgAddressAssembler.ts";
import type { APIContext } from "astro";
import type { CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { PageOgDetails } from "@app/infrastructure/render/og/details/PageOgDetails";
import { PageOgDetailsAssembler } from "@app/infrastructure/render/og/details/PageOgDetailsAssembler.ts";
import { SITE } from "@app/configuration/site/Site";
import type { Tag } from "@app/feature/publication/tag/Tag";

import { OgImageRenderingService } from "@app/infrastructure/render/og/OgImageRenderingService.ts";
import { PageCards } from "@app/infrastructure/render/og/details/PageCards.ts";
import { PublicationQueryService } from "@app/feature/publication/PublicationQueryService.ts";
import { RoutePathResolver } from "@app/util/routing/RoutePathResolver.ts";
import { TagPageMetadataResolver } from "@app/feature/publication/tag/TagPageMetadataResolver.ts";

const OG_IMAGE_RENDERING_SERVICE: OgImageRenderingService = new OgImageRenderingService();
const PAGE_OG_DETAILS_ASSEMBLER: PageOgDetailsAssembler = new PageOgDetailsAssembler();
const PAGE_CARDS: PageCards = new PageCards(new PageOgAddressAssembler());
const PUBLICATION_QUERY_SERVICE: PublicationQueryService = new PublicationQueryService(
    new SlugFormatter(),
    new PublicationConfiguration()
);
const ROUTE_PATH_RESOLVER: RoutePathResolver = new RoutePathResolver();
const TAG_PAGE_METADATA_RESOLVER: TagPageMetadataResolver = new TagPageMetadataResolver();
export async function getStaticPaths() {
    const publications: CollectionEntry<"blog">[] = await getCollection("blog");

    const keywords: {
        params: { page: string };
        props: { title: string; description: string; address: string };
    }[] = PUBLICATION_QUERY_SERVICE.collectTags(publications).map((tag: Tag) => {
        const held: CollectionEntry<"blog">[] = PUBLICATION_QUERY_SERVICE.findByTag(publications, tag.getTag());

        return {
            params: { page: ROUTE_PATH_RESOLVER.tagImageKey(tag.getTag()) },
            props: {
                title: `#${tag.getTagName()}`,
                description: TAG_PAGE_METADATA_RESOLVER.resolve(
                    tag.getTagName(),
                    SITE.getAuthor(),
                    held.map(({ data }: CollectionEntry<"blog">) => data.title)
                ).getDescription(),
                address: new PageOgAddressAssembler().assemble(ROUTE_PATH_RESOLVER.resolveTag(tag.getTag())),
            },
        };
    });

    return [
        ...Object.entries(PAGE_CARDS.getAll()).map(([page, details]: [string, PageOgDetails]) => ({
            params: { page },
            props: details,
        })),
        ...keywords,
    ];
}

export const GET: APIRoute = async ({ props }: APIContext) =>
    new Response(await OG_IMAGE_RENDERING_SERVICE.renderPage(PAGE_OG_DETAILS_ASSEMBLER.assemble(props)), {
        headers: { "Content-Type": "image/png" },
    });
