import { REPOSITORY_CONFIGURATION as REPOSITORY_CONFIGURATION_KEY } from "@bindings";
import type { APIContext } from "astro";
import type { APIRoute } from "astro";
import type { GithubRepositoryData } from "@app/infrastructure/api/github/repository/data/GithubRepositoryData";
import type { FeaturedSoftware } from "@app/feature/software/featured/FeaturedSoftware";
import type { RepositoryProfile } from "@app/feature/repository/profile/RepositoryProfile";
import type { RepositoryOgDetails } from "@app/infrastructure/render/og/details/RepositoryOgDetails";

import { CONTEXT } from "@app/ApplicationContext.ts";
import { OgImageRenderingService } from "@app/infrastructure/render/og/OgImageRenderingService.ts";
import { RepositoryOgDetailsAssembler } from "@app/infrastructure/render/og/details/RepositoryOgDetailsAssembler.ts";
import { RepositoryConfiguration } from "@app/feature/repository/profile/RepositoryConfiguration.ts";
import { RepositoryOgDetailsResolver } from "@app/feature/repository/page/RepositoryOgDetailsResolver.ts";
import { RepositoryProfileResolver } from "@app/feature/repository/profile/RepositoryProfileResolver.ts";
import { REPOSITORY_PROFILE_RETRIEVAL_SERVICE as REPOSITORY_PROFILE_RETRIEVAL_SERVICE_KEY } from "@bindings";
import { FeaturedSoftwareRetrievalService } from "@app/feature/software/featured/FeaturedSoftwareRetrievalService.ts";
import { GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE as GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY } from "@bindings";

const OG_IMAGE_RENDERING_SERVICE: OgImageRenderingService = CONTEXT.resolve(OgImageRenderingService);
const REPOSITORY_OG_DETAILS_ASSEMBLER: RepositoryOgDetailsAssembler = CONTEXT.resolve(RepositoryOgDetailsAssembler);
const REPOSITORY_CONFIGURATION: RepositoryConfiguration = CONTEXT.resolve(REPOSITORY_CONFIGURATION_KEY);
const REPOSITORY_OG_DETAILS_RESOLVER: RepositoryOgDetailsResolver = CONTEXT.resolve(RepositoryOgDetailsResolver);
const REPOSITORY_PROFILE_RESOLVER: RepositoryProfileResolver = CONTEXT.resolve(RepositoryProfileResolver);
const REPOSITORY_PROFILE_RETRIEVAL_SERVICE = CONTEXT.resolve(REPOSITORY_PROFILE_RETRIEVAL_SERVICE_KEY);
const FEATURED_SOFTWARE_RETRIEVAL_SERVICE: FeaturedSoftwareRetrievalService = CONTEXT.resolve(
    FeaturedSoftwareRetrievalService
);
const GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE = CONTEXT.resolve(GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE_KEY);
export async function getStaticPaths() {
    const repositories: GithubRepositoryData[] = await GITHUB_REPOSITORY_DATA_RETRIEVAL_SERVICE.retrieve();
    const curated: FeaturedSoftware[] = await FEATURED_SOFTWARE_RETRIEVAL_SERVICE.retrieve();

    const profiled: GithubRepositoryData[] = repositories.filter((githubRepositoryData: GithubRepositoryData) =>
        REPOSITORY_CONFIGURATION.profiles(githubRepositoryData.getName())
    );

    const pages: {
        params: { slug: string };
        props: RepositoryOgDetails | null;
    }[] = await Promise.all(
        profiled.map(async (githubRepositoryData: GithubRepositoryData) => {
            const gathered: RepositoryProfile | null = await REPOSITORY_PROFILE_RETRIEVAL_SERVICE.retrieve(
                githubRepositoryData.getName()
            );

            return {
                params: { slug: githubRepositoryData.getName() },
                props: gathered
                    ? REPOSITORY_OG_DETAILS_RESOLVER.resolve(REPOSITORY_PROFILE_RESOLVER.resolve(gathered, curated))
                    : null,
            };
        })
    );

    return pages.filter((page: { params: { slug: string }; props: RepositoryOgDetails | null }) => page.props !== null);
}

export const GET: APIRoute = async ({ props }: APIContext) =>
    new Response(await OG_IMAGE_RENDERING_SERVICE.renderRepository(REPOSITORY_OG_DETAILS_ASSEMBLER.assemble(props)), {
        headers: { "Content-Type": "image/png" },
    });
